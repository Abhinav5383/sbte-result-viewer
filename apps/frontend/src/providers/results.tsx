import { decodeResults, type EncodedResult } from "@app/shared/encoder";
import type { ParsedResult } from "@app/shared/types";
import { createContext, createResource, type JSX, type Resource, useContext } from "solid-js";

interface ResultsContext {
    results: Resource<ParsedResult[]>;
    refetch: () => void;
}
const resultsContext = createContext<ResultsContext>();

export function ResultsProvider(props: { children: JSX.Element }) {
    const [results, { refetch }] = createResource(async (): Promise<ParsedResult[]> => {
        if (typeof __EMBEDDED_RESULTS__ !== "undefined") {
            return decodeEmbeddedResults(__EMBEDDED_RESULTS__);
        }

        const res = await fetch(`http://${window.location.hostname}:5500/students-data`);
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        const data = (await res.json()) as EncodedResult[];
        return decodeResults(data);
    });

    return (
        <resultsContext.Provider
            value={{
                results,
                refetch,
            }}
        >
            {props.children}
        </resultsContext.Provider>
    );
}

export function useResults(): ResultsContext {
    const context = useContext(resultsContext);
    if (!context) {
        throw new Error("useResults must be used within a ResultsProvider");
    }

    return context;
}

// Declare the global embedded data (injected at build time) - gzip+base64 encoded string
declare const __EMBEDDED_RESULTS__: string | undefined;

async function decodeEmbeddedResults(base64: string): Promise<ParsedResult[]> {
    if (typeof DecompressionStream === "undefined") {
        throw new Error("DecompressionStream is not supported in this browser");
    }

    // base64 -> gzip -> JSON
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    // Decompress using DecompressionStream (browser native)
    const ds = new DecompressionStream("gzip");
    const decompressed = new Response(ds.readable).text();

    const writer = ds.writable.getWriter();
    await writer.write(bytes);
    await writer.close();

    const encoded = JSON.parse(await decompressed) as EncodedResult[];
    return decodeResults(encoded);
}
