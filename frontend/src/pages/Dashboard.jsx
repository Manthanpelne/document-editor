import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../App';
import toast from 'react-hot-toast';


const Header = ({ username, logout }) => (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Collab Editor</h1>
        <div className="flex items-center space-x-4">
            <span className="text-gray-700">Logged in as: <span className="font-semibold">{username}</span></span>
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Logout</button>
        </div>
    </header>
);


export const Dashboard = () => {
  const {user, logout, api} = useAuth()
  
  const [documents, setDocuments] = useState([])
  const[loading, setLoading] = useState(true)
  const navigate = useNavigate()

  //fetching user's documents
  const fetchDocuments = async()=>{
     try {
      const response = await api(`GET`, `${API_BASE_URL}/documents/user`)
      const data = await response.json()
      if(response.ok){
        setDocuments(data)
      }else{
        toast.error("Failed to fetch documents")
      }
     } catch (error) {
      console.error(error)
      toast.error("Network error fetching documents")
     }finally{
      setLoading(false)
     }
  }


  //creating new document
  const createNewDocument = async()=>{
    const title = prompt("Enter title for new document:");
    if(!title || title.trim()===""){
      return toast.error("Document title cannot be empty.");
    }
    try {
      const response = await api("POST",`${API_BASE_URL}/documents`,{title});
      const newDoc = await response.json()
       if (response.ok) {
                toast.success('Document created!');
                navigate(`/document/${newDoc._id}`);
            } else {
                toast.error(newDoc.msg || "Failed to create document");
            }
    } catch (error) {
       console.error(error);
       toast.error("Network error creating document");
    }
  }

  useEffect(()=>{
    fetchDocuments()
  },[])

  return (
    <>
     <Header username={user?.username} logout={logout} />
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800">My Documents</h2>
                    <button
                        onClick={createNewDocument}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                    >
                        + Create New Document
                    </button>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading documents...</p>
                ) : documents.length === 0 ? (
                    <div className="text-center p-10 border-2 border-dashed rounded-lg text-gray-500">
                        No documents found. Click "Create New Document" to start.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc) => (
                            <div
                                key={doc._id}
                                className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border-l-4 border-blue-500"
                                onClick={() => navigate(`/document/${doc._id}`)}
                            >
                                <h3 className="text-xl font-bold text-gray-800 truncate">{doc.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Last Updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {doc.ownerId === user.id ? 'Owner: You' : 'Owner: Collaborator'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
    </>
  )
}
