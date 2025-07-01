import Link from "next/link";

const Cta = () => {
    return (
        <Link href="/companions/new">
            <button className="btn-primary w-full justify-center">
                Build a New Companion
            </button>
        </Link>
    )
}
export default Cta
