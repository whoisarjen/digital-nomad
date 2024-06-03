import Link from "next/link"

type ModalPageProps = {
    children: React.ReactNode
    closeHref: string
}

function Modal({ children, closeHref }: ModalPageProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-semibold">Modal Title</h2>
                    <Link href={closeHref} scroll={false} className="text-gray-400 hover:text-gray-600">&times;</Link>
                </div>
                <div className="mt-4">
                    <p className="mb-4">{children}</p>
                </div>
                <div className="flex justify-end pt-4 border-t mt-4">
                    <Link href={closeHref} scroll={false} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Close</Link>
                </div>
            </div>
        </div>
    )
}

export default function Page() {
    return (
        <Modal closeHref="/">
            Lorem ipsum – tekst składający się z łacińskich i quasi-łacińskich wyrazów, mający korzenie w klasycznej łacinie, wzorowany na fragmencie traktatu Cycerona „O granicach dobra i zła” napisanego w 45 p.n.e. Tekst jest stosowany do demonstracji krojów pisma, kompozycji kolumny itp.
        </Modal>
    )
}