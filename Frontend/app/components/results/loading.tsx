export default function ResultsLoading() {
    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-8 shadow-sm">
            <div className="flex min-h-[260px] flex-col items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d7eff0] border-t-[#1daaad]" />
                <p className="mt-4 text-sm font-medium text-[#1a535c]/75">
                    Φόρτωση δεδομένων...
                </p>
            </div>
        </div>
    )
}