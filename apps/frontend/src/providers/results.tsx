import type { EncodedData } from "@app/shared/encoder";
import { createContext, createResource, ErrorBoundary, type JSX, type Resource, useContext } from "solid-js";
import { Button } from "~/components/ui/button";
import getCompressedResultsData from "~/data/results";

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
        try {
            return await decodeEmbeddedResults(await getCompressedResultsData());
        } catch (e) {
            console.error(e);
            throw e;
        }
    });

    return (
        <resultsContext.Provider
            value={{
                data: results,
                refetch,
            }}
        >
            <ErrorBoundary
                fallback={(err, reset) => (
                    <div class="min-h-[75vh] grid place-content-center justify-items-center gap-4 p-8">
                        <span class="text-3xl text-rose-500 font-semibold">Failed to load results!</span>
                        <span class="text-dim-fg text-sm">{err?.message || "Unknown error occurred"}</span>
                        <Button
                            variant="primary-alt"
                            onClick={() => {
                                refetch();
                                reset();
                            }}
                        >
                            Retry
                        </Button>
                    </div>
                )}
            >
                {props.children}
            </ErrorBoundary>
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
