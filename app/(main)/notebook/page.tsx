
import FetchNotebook from '@/components/FetchNotebook'
import CreateNotebook from '@/components/CreateNotebook'



// export default function Home() {
    
//     return (
//         <div className="space-y-6 bg-gray-900 p-6 rounded-xl">
//             <CreateNotebook/>
//             <FetchNotebook/>
//         </div>
//     )
// }

export default function Home() {
    return (
      <div className="flex-1 h-[calc(90vh-128px)] overflow-y-auto bg-slate-900 rounded-xl">
        <div className="space-y-6 bg-gray-900 p-6 rounded-xl mx-6">
          <CreateNotebook />
          <FetchNotebook />
        </div>
      </div>
    );
  }