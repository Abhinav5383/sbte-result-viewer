import type { EncodedData } from "@app/shared/encoder";
import { createContext, createResource, type JSX, type Resource, useContext } from "solid-js";
import CompressedResultsData from "~/data/results";

interface ResultsContext {
    data: Resource<EncodedData>;
    refetch: () => void;
}
const resultsContext = createContext<ResultsContext>();

export function useResults(): ResultsContext {
    const context = useContext(resultsContext);
    if (!context) {
        throw new Error("useResults must be used within a ResultsProvider");
    }

    return context;
}

export function ResultsProvider(props: { children: JSX.Element }) {
    const [results, { refetch }] = createResource(async (): Promise<EncodedData> => {
        if (typeof CompressedResultsData !== "undefined") {
            return decodeEmbeddedResults(CompressedResultsData);
        }

        const res = await fetch(`http://${window.location.hostname}:5500/students-data`);
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        const data = (await res.json()) as EncodedData;
        return data;
    });

    return (
        <resultsContext.Provider
            value={{
                data: results,
                refetch,
            }}
        >
            {props.children}
        </resultsContext.Provider>
    );
}

async function decodeEmbeddedResults(base64: string): Promise<EncodedData> {
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

    const encoded = JSON.parse(await decompressed) as EncodedData;
    return encoded;
}
