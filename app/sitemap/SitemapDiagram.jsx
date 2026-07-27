// "use client";

// import Link from "next/link";

// export default function SitemapDiagram({ navLinks = [] }) {
//   return (
//     <div className="col-12">
//       <div className="row g-4">
//         {/* Home */}
//         <div className="col-md-6 col-lg-4">
//           <div className="card border-0 shadow-sm h-100">
//             <div className="card-body">
//               <h4 className="fw-bold mb-0">
//                 <Link href="/" className="text-decoration-none">
//                   Home
//                 </Link>
//               </h4>
//             </div>
//           </div>
//         </div>

//         {navLinks.map((item) => (
//           <div
//             className="col-md-6 col-lg-4"
//             key={item.href || item.title}
//           >
//             <div className="card border-0 shadow-sm h-100">
//               <div className="card-body">
//                 <h4 className="fw-bold mb-3">
//                   {item.href ? (
//                     <Link
//                       href={item.href}
//                       className="text-decoration-none"
//                     >
//                       {item.title}
//                     </Link>
//                   ) : (
//                     item.title
//                   )}
//                 </h4>

//                 {item.children?.length > 0 && (
//                   <ul className="list-unstyled mb-0">
//                     {item.children.map((child) => (
//                       <li key={child.href || child.title} className="mb-2">
//                         <Link
//                           href={child.href}
//                           className="text-decoration-none text-secondary"
//                         >
//                           <i className="bi bi-arrow-return-right me-2"></i>
//                           {child.title}
//                         </Link>

//                         {child.children?.length > 0 && (
//                           <ul className="list-unstyled ms-4 mt-2">
//                             {child.children.map((sub) => (
//                               <li key={sub.href || sub.title} className="mb-2">
//                                 <Link
//                                   href={sub.href}
//                                   className="text-decoration-none text-muted"
//                                 >
//                                   <i className="bi bi-dot"></i>
//                                   {sub.title}
//                                 </Link>
//                               </li>
//                             ))}
//                           </ul>
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }