import styles from "./styles.module.css";

export default function BouncingDotsLoader(props: { class?: string }) {
    return (
        <div class={`${styles.wrapper} ${props.class}`}>
            <div class={styles.circle}></div>
            <div class={styles.circle}></div>
            <div class={styles.circle}></div>
            <div class={styles.shadow}></div>
            <div class={styles.shadow}></div>
            <div class={styles.shadow}></div>
        </div>
    );
}
