import Link from "next/link"
import { ArrowLeft, MapPinOff } from "lucide-react"

export default function ServiceRegionNotFound() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(180deg,#f8fafc_0%,#f7fdfd_38%,#ffffff_100%)] px-4 py-16 md:px-6 md:py-24">
            <div className="mx-auto max-w-3xl rounded-[1.8rem] border border-[#d7eff0] bg-white p-8 text-center shadow-[0_20px_50px_rgba(29,170,173,0.10)]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eefafa] text-[#1daaad]">
                    <MapPinOff className="h-6 w-6" />
                </div>

                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#1a535c]">
                    Η περιοχή δεν βρέθηκε
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#1a535c]/78 md:text-base">
                    Η διεύθυνση που άνοιξες δεν αντιστοιχεί σε διαθέσιμη περιοχή του καταλόγου.
                    Συμβαίνει. Οι διαδρομές θέλουν λίγο περισσότερη πειθαρχία απ’ όση δείχνουν
                    συνήθως οι άνθρωποι.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href="/services"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1daaad] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(29,170,173,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#179ca0]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Επιστροφή στις υπηρεσίες
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex h-11 items-center justify-center rounded-full border border-[#d7eff0] bg-white px-6 text-sm font-semibold text-[#1a535c] transition-colors hover:bg-[#f7fcfc]"
                    >
                        Αρχική
                    </Link>
                </div>
            </div>
        </div>
    )
}