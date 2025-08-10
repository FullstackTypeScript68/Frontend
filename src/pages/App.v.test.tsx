// import { useEffect, useState } from "react";
// import {
//   Search,
//   Plus,
//   Edit2,
//   Trash2,
//   Sun,
//   Moon,
//   LogOut,
//   Calendar,
//   Clock,
//   BookOpen,
//   Target,
// } from "lucide-react";

// // Mock data for demonstration
// const mockTodos = [
//   {
//     id: "1",
//     todoText: "Complete project documentation",
//     createdAt: "2025-08-10T10:30:00Z",
//     imageUrl: null,
//   },
//   {
//     id: "2",
//     todoText: "Review code changes",
//     createdAt: "2025-08-10T14:15:00Z",
//     imageUrl: null,
//   },
//   {
//     id: "3",
//     todoText: "Prepare presentation slides",
//     createdAt: "2025-08-09T16:45:00Z",
//     imageUrl: null,
//   },
// ];

// const mockOwners = [
//   {
//     id: "1",
//     name: "Alex Chen",
//     courseId: "CS401",
//     section: "A",
//     createdAt: "2025-08-10T09:00:00Z",
//   },
//   {
//     id: "2",
//     name: "Maria Santos",
//     courseId: "CS402",
//     section: "B",
//     createdAt: "2025-08-10T10:30:00Z",
//   },
// ];

// function App() {
//   const [todos, setTodos] = useState(mockTodos);
//   const [owners, setOwners] = useState(mockOwners);
//   const [inputText, setInputText] = useState("");
//   const [mode, setMode] = useState("ADD");
//   const [curTodoId, setCurTodoId] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [searchText, setSearchText] = useState("");

//   const handleChange = (e) => {
//     setInputText(e.target.value);
//   };

//   const handleImageChange = (e) => {
//     setImageFile(e.target.files?.[0] ?? null);
//   };

//   function matchesSearch(item, q) {
//     if (!q) return true;
//     const s = q.trim().toLowerCase();
//     return item.todoText?.toLowerCase().includes(s);
//   }

//   const handleSubmit = () => {
//     if (!inputText) return;

//     if (mode === "ADD") {
//       const newTodo = {
//         id: Date.now().toString(),
//         todoText: inputText,
//         createdAt: new Date().toISOString(),
//         imageUrl: null,
//       };
//       setTodos([newTodo, ...todos]);
//     } else {
//       setTodos(
//         todos.map((todo) =>
//           todo.id === curTodoId ? { ...todo, todoText: inputText } : todo
//         )
//       );
//     }

//     setInputText("");
//     setImageFile(null);
//     setCurTodoId("");
//     setMode("ADD");
//     setShowModal(false);
//   };

//   const handleDelete = (id) => {
//     setTodos(todos.filter((todo) => todo.id !== id));
//     if (id === curTodoId) {
//       cancelEdit();
//     }
//   };

//   const startEdit = (todo) => {
//     setMode("EDIT");
//     setCurTodoId(todo.id);
//     setInputText(todo.todoText);
//     setShowModal(true);
//   };

//   const cancelEdit = () => {
//     setMode("ADD");
//     setInputText("");
//     setCurTodoId("");
//     setImageFile(null);
//   };

//   const formatDateTime = (dateStr) => {
//     const date = new Date(dateStr);
//     return {
//       date: date.toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "2-digit",
//       }),
//       time: date.toLocaleTimeString("en-GB", {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };
//   };

//   const compareDate = (a, b) => {
//     return new Date(b.createdAt) - new Date(a.createdAt);
//   };

//   return (
//     <div
//       className={`min-h-screen transition-all duration-500 ease-in-out ${
//         isDarkMode
//           ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
//           : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
//       }`}
//     >
//       {/* Floating orbs for ambiance */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div
//           className={`absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse ${
//             isDarkMode ? "bg-purple-500" : "bg-blue-400"
//           }`}
//         ></div>
//         <div
//           className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-15 animate-pulse delay-1000 ${
//             isDarkMode ? "bg-cyan-500" : "bg-purple-400"
//           }`}
//         ></div>
//       </div>

//       <div className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
//         {/* Header with theme toggle */}
//         <div className="flex justify-between items-center mb-8">
//           <div className="flex items-center space-x-4">
//             <div
//               className={`p-3 rounded-2xl ${
//                 isDarkMode
//                   ? "bg-gradient-to-r from-purple-600 to-cyan-600"
//                   : "bg-gradient-to-r from-blue-500 to-purple-500"
//               } shadow-lg`}
//             >
//               <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
//                 <span className="text-2xl">✨</span>
//               </div>
//             </div>
//             <div>
//               <h1
//                 className={`text-4xl font-bold bg-gradient-to-r ${
//                   isDarkMode
//                     ? "from-purple-400 to-cyan-400"
//                     : "from-blue-600 to-purple-600"
//                 } bg-clip-text text-transparent`}
//               >
//                 TODO APP
//               </h1>
//               <p
//                 className={`text-sm ${
//                   isDarkMode ? "text-gray-400" : "text-gray-600"
//                 } mt-1`}
//               >
//                 Organize your tasks with style ✨
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => setIsDarkMode(!isDarkMode)}
//               className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
//                 isDarkMode
//                   ? "bg-white/10 backdrop-blur-lg text-yellow-400 hover:bg-white/20"
//                   : "bg-black/10 backdrop-blur-lg text-orange-500 hover:bg-black/20"
//               } border border-white/20 shadow-lg`}
//             >
//               {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//             </button>

//             <button className="p-3 rounded-xl bg-red-500/20 backdrop-blur-lg text-red-400 hover:bg-red-500/30 transition-all duration-300 hover:scale-105 border border-red-500/30 shadow-lg">
//               <LogOut size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Owner List Section */}
//         <div className="mb-8">
//           <div
//             className={`backdrop-blur-xl rounded-2xl p-6 shadow-2xl border ${
//               isDarkMode
//                 ? "bg-white/5 border-white/10"
//                 : "bg-white/70 border-white/50"
//             }`}
//           >
//             <div className="flex items-center space-x-3 mb-6">
//               <div
//                 className={`p-2 rounded-lg ${
//                   isDarkMode
//                     ? "bg-gradient-to-r from-purple-500 to-pink-500"
//                     : "bg-gradient-to-r from-blue-500 to-cyan-500"
//                 }`}
//               >
//                 <BookOpen size={20} className="text-white" />
//               </div>
//               <h2
//                 className={`text-2xl font-bold ${
//                   isDarkMode ? "text-white" : "text-gray-800"
//                 }`}
//               >
//                 Owner List
//               </h2>
//             </div>

//             {owners.length === 0 ? (
//               <p
//                 className={`text-center py-8 ${
//                   isDarkMode ? "text-gray-400" : "text-gray-600"
//                 }`}
//               >
//                 No owners found 🤷‍♀️
//               </p>
//             ) : (
//               <div className="grid gap-4">
//                 {owners.map((owner) => (
//                   <div
//                     key={owner.id}
//                     className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
//                       isDarkMode
//                         ? "bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15"
//                         : "bg-white/80 backdrop-blur-lg border border-white/50 hover:bg-white/90"
//                     } shadow-lg`}
//                   >
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center space-x-4">
//                         <div
//                           className={`w-12 h-12 rounded-full ${
//                             isDarkMode
//                               ? "bg-gradient-to-r from-cyan-400 to-purple-400"
//                               : "bg-gradient-to-r from-blue-400 to-purple-400"
//                           } flex items-center justify-center text-white font-bold text-lg`}
//                         >
//                           {owner.name.charAt(0)}
//                         </div>
//                         <div>
//                           <h3
//                             className={`font-bold text-lg ${
//                               isDarkMode ? "text-white" : "text-gray-800"
//                             }`}
//                           >
//                             {owner.name}
//                           </h3>
//                           <div className="flex items-center space-x-4 mt-1">
//                             <div className="flex items-center space-x-1">
//                               <BookOpen
//                                 size={14}
//                                 className={
//                                   isDarkMode
//                                     ? "text-purple-400"
//                                     : "text-blue-500"
//                                 }
//                               />
//                               <span
//                                 className={`text-sm ${
//                                   isDarkMode ? "text-gray-300" : "text-gray-600"
//                                 }`}
//                               >
//                                 {owner.courseId}
//                               </span>
//                             </div>
//                             <div className="flex items-center space-x-1">
//                               <Target
//                                 size={14}
//                                 className={
//                                   isDarkMode
//                                     ? "text-cyan-400"
//                                     : "text-purple-500"
//                                 }
//                               />
//                               <span
//                                 className={`text-sm ${
//                                   isDarkMode ? "text-gray-300" : "text-gray-600"
//                                 }`}
//                               >
//                                 Section {owner.section}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-1 text-sm text-gray-500">
//                         <Clock size={14} />
//                         <span>{formatDateTime(owner.createdAt).date}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Search and Add Section */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <div className="flex-1 relative">
//             <Search
//               size={20}
//               className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
//                 isDarkMode ? "text-gray-400" : "text-gray-500"
//               }`}
//             />
//             <input
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               placeholder="Search your todos... ✨"
//               className={`w-full pl-12 pr-4 py-4 rounded-xl transition-all duration-300 focus:scale-[1.02] ${
//                 isDarkMode
//                   ? "bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-400 focus:bg-white/15"
//                   : "bg-white/80 backdrop-blur-lg border border-white/50 text-gray-800 placeholder-gray-500 focus:bg-white/90"
//               } shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
//             />
//             {searchText && (
//               <button
//                 onClick={() => setSearchText("")}
//                 className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:scale-110 transition-all ${
//                   isDarkMode
//                     ? "text-gray-400 hover:text-white"
//                     : "text-gray-500 hover:text-gray-800"
//                 }`}
//               >
//                 ✖
//               </button>
//             )}
//           </div>

//           <button
//             onClick={() => setShowModal(true)}
//             className={`px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
//               isDarkMode
//                 ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
//                 : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400"
//             } text-white shadow-lg flex items-center space-x-2`}
//           >
//             <Plus size={20} />
//             <span>Add Todo</span>
//           </button>
//         </div>

//         {/* Todo List */}
//         <div
//           className={`backdrop-blur-xl rounded-2xl p-6 shadow-2xl border ${
//             isDarkMode
//               ? "bg-white/5 border-white/10"
//               : "bg-white/70 border-white/50"
//           }`}
//         >
//           <h2
//             className={`text-2xl font-bold mb-6 ${
//               isDarkMode ? "text-white" : "text-gray-800"
//             }`}
//           >
//             Your Tasks ✨
//           </h2>

//           <div className="space-y-4">
//             {todos
//               .filter((t) => matchesSearch(t, searchText))
//               .sort(compareDate)
//               .map((item, idx) => {
//                 const { date, time } = formatDateTime(item.createdAt);
//                 return (
//                   <div
//                     key={item.id}
//                     className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
//                       isDarkMode
//                         ? "bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15"
//                         : "bg-white/80 backdrop-blur-lg border border-white/50 hover:bg-white/90"
//                     } shadow-lg group`}
//                   >
//                     <div className="flex items-center space-x-4">
//                       <div
//                         className={`w-10 h-10 rounded-full ${
//                           isDarkMode
//                             ? "bg-gradient-to-r from-purple-500 to-pink-500"
//                             : "bg-gradient-to-r from-blue-500 to-cyan-500"
//                         } flex items-center justify-center text-white font-bold`}
//                       >
//                         {idx + 1}
//                       </div>

//                       {item.imageUrl && (
//                         <img
//                           src={item.imageUrl}
//                           alt="todo"
//                           className="w-16 h-16 object-cover rounded-xl shadow-lg"
//                         />
//                       )}

//                       <div className="flex-1">
//                         <p
//                           className={`font-semibold text-lg ${
//                             isDarkMode ? "text-white" : "text-gray-800"
//                           }`}
//                         >
//                           {item.todoText}
//                         </p>
//                         <div className="flex items-center space-x-4 mt-2">
//                           <div className="flex items-center space-x-1">
//                             <Calendar
//                               size={14}
//                               className={
//                                 isDarkMode ? "text-purple-400" : "text-blue-500"
//                               }
//                             />
//                             <span
//                               className={`text-sm ${
//                                 isDarkMode ? "text-gray-400" : "text-gray-600"
//                               }`}
//                             >
//                               {date}
//                             </span>
//                           </div>
//                           <div className="flex items-center space-x-1">
//                             <Clock
//                               size={14}
//                               className={
//                                 isDarkMode ? "text-cyan-400" : "text-purple-500"
//                               }
//                             />
//                             <span
//                               className={`text-sm ${
//                                 isDarkMode ? "text-gray-400" : "text-gray-600"
//                               }`}
//                             >
//                               {time}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button
//                           onClick={() => startEdit(item)}
//                           className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all hover:scale-110"
//                         >
//                           <Edit2 size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(item.id)}
//                           className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all hover:scale-110"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>

//           {todos.filter((t) => matchesSearch(t, searchText)).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-6xl mb-4">🌟</div>
//               <p
//                 className={`text-xl ${
//                   isDarkMode ? "text-gray-400" : "text-gray-600"
//                 }`}
//               >
//                 {searchText
//                   ? "No matching todos found"
//                   : "No todos yet! Add your first task ✨"}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div
//             className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-all duration-300 scale-100 ${
//               isDarkMode
//                 ? "bg-slate-900/90 backdrop-blur-xl border-white/20"
//                 : "bg-white/90 backdrop-blur-xl border-white/50"
//             }`}
//           >
//             <h2
//               className={`text-2xl font-bold mb-6 ${
//                 isDarkMode ? "text-white" : "text-gray-800"
//               }`}
//             >
//               {mode === "ADD" ? "✨ Add New Todo" : "🖊️ Edit Todo"}
//             </h2>

//             <input
//               type="text"
//               value={inputText}
//               onChange={handleChange}
//               placeholder="What needs to be done? ✨"
//               className={`w-full p-4 rounded-xl mb-4 transition-all duration-300 focus:scale-[1.02] ${
//                 isDarkMode
//                   ? "bg-white/10 border border-white/20 text-white placeholder-gray-400"
//                   : "bg-white/80 border border-gray-300 text-gray-800 placeholder-gray-500"
//               } focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
//             />

//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className={`w-full p-4 rounded-xl mb-6 transition-all duration-300 ${
//                 isDarkMode
//                   ? "bg-white/10 border border-white/20 text-white"
//                   : "bg-white/80 border border-gray-300 text-gray-800"
//               }`}
//             />

//             <div className="flex space-x-3">
//               <button
//                 onClick={handleSubmit}
//                 className="flex-1 py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white transition-all duration-300 hover:scale-105 active:scale-95"
//               >
//                 {mode === "ADD" ? "✨ Create" : "💫 Update"}
//               </button>
//               <button
//                 onClick={() => {
//                   setShowModal(false);
//                   mode === "EDIT" ? cancelEdit() : setImageFile(null);
//                 }}
//                 className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
//                   isDarkMode
//                     ? "bg-white/20 text-white hover:bg-white/30"
//                     : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//                 }`}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
