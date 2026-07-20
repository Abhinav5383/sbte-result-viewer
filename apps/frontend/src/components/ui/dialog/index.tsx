import { createEffect, createSignal, type JSX } from "solid-js";
import "./styles.css";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    children: JSX.Element;
    dialogProps?: JSX.DialogHtmlAttributes<HTMLDialogElement>;
}

export function Dialog(props: DialogProps) {
    const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement | null>(null);

    createEffect(() => {
        const dialog = dialogRef();
        if (dialog) {
            if (props.open && !dialog.open) dialog.showModal();
            if (!props.open && dialog.open) dialog.close();
        }
    });

    return (
        <dialog
            onClose={(e) => {
                e.preventDefault();
                props.onClose();
            }}
            onKeyDown={(e) => {
                if (e.key === "Escape") props.onClose();
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    e.stopPropagation();
                    props.onClose();
                }
            }}
            {...props.dialogProps}
            ref={setDialogRef}
            class={`__dialog ${props.dialogProps?.class ?? ""}`}
        >
            {props.children}
        </dialog>
    );
}
