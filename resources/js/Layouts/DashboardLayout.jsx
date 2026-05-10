export default function DashboardLayout({ children }) {

    return (
        <div className="min-h-screen bg-gray-100">

            {/* HEADER */}

            <header className="bg-black text-white px-6 py-4 shadow">

                <h1 className="text-2xl font-bold">
                    Polaroid Generator
                </h1>

            </header>

            {/* CONTENT */}

            <main className="p-6">
                {children}
            </main>

        </div>
    );
}