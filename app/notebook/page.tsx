
import FetchNotebook from '@/components/FetchNotebook'
import CreateNotebook from '@/components/CreateNotebook'



export default function Home() {
    
    return (
        <div className="space-y-6">
            <CreateNotebook/>
            <FetchNotebook/>
        </div>
    )
}

