interface NavbarProps {
    collegeName?: string;
}

export default function Navbar(props: NavbarProps) {
    const collegeName = () => props.collegeName ?? "NGP Patna-13";

    return (
        <header class="grid bg-linear-to-r from-[lch(from_var(--color-accent-bg)_calc(l-10)_c_calc(h+10))] to-accent-bg py-4">
            <div class="flex gap-3 justify-center font-extrabold text-2xl text-accent-bg-text">
                <span>Semester Exam Results</span>
                <span>({collegeName()})</span>
            </div>
        </header>
    );
}
