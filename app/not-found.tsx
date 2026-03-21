import Link from "next/link"
import { MapPin } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#f7fdfd_38%,#ffffff_100%)] px-4">
            <div className="w-full max-w-md rounded-[1.7rem] border border-[#d7eff0] bg-white p-10 text-center shadow-sm">

                {/* Icon */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0fafa]">
                    <MapPin  size={50} color="#1daaad"/>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-[#1a535c]">
                    Δεν βρέθηκε 
                </h1>

                <p className="mt-3 text-sm leading-7 text-[#1a535c]/70 md:text-base">
                    Η Σελιδά που αναζητάς δεν είναι διαθέσιμη.
                </p>

                <Link
                    href="/services"
                    className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[#1daaad] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#179ca0]"
                >
                    Επιστροφή στις υπηρεσίες
                </Link>
            </div>
        </div>
    )
}