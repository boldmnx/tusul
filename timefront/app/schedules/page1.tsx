// "use client";
// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import tempData from "@/app/schedules/tempData.json";

// type Entry = {
//   day: string;
//   time: string;
//   room: string;
//   teacher: string;
//   course: string;
//   session: string;
//   groups: string[];
// };

// export default function SchedulePage() {
//   const [schedules, setSchedules] = useState<Entry[][]>([]);

//   console.log(`>>>>>>>>>>>1`);
//   useEffect(() => {
//     console.log(`>>>>>>>>>>>2`);
//     // Жишээ mock дата
//     setSchedules(tempData);
//     console.log(`>>>>>>>>>>>3`);
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Хуваарь</h1>

//       <Tabs defaultValue="0" className="w-full">
//         <TabsList className="flex flex-wrap gap-2 mb-4">
//           {schedules.map((_, idx) => (
//             <TabsTrigger key={idx} value={idx.toString()}>
//               Хуваарь {idx + 1}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         {schedules.map((schedule, idx) => (
//           <TabsContent key={idx} value={idx.toString()}>
//             <div className="grid md:grid-cols-2 gap-4">
//               {schedule.map((entry, i) => (
//                 <Card key={i} className="shadow-md">
//                   <CardContent className="p-4">
//                     <p className="font-semibold">
//                       {entry.course} ({entry.session})
//                     </p>
//                     <p>
//                       {entry.day} {entry.time}
//                     </p>
//                     <p>Өрөө: {entry.room}</p>
//                     <p>Багш: {entry.teacher}</p>
//                     <p>Анги: {entry.groups.join(", ")}</p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>
//         ))}
//       </Tabs>
//     </div>
//   );
// }
