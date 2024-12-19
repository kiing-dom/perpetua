
export default function Dashboard() {
    return (
        <div className="min-h-screen p-6 my-6">
            <h1 className="text-2xl font-bold mb-4 dark:text-white text-neutral-600">My Notes</h1>
            {/* Placeholder for notes here */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded shadow">Placeholder 1</div>
                <div className="p-4 bg-white rounded shadow">Placeholder 2</div>
            </div>
        </div>
    )
}