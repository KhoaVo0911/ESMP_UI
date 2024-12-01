// import { Card } from "flowbite-react";
// import React from "react";

// // motion
// import { motion } from "framer-motion";
// // variants
// import { fadeIn } from "./variants";
// import blog1 from "../../assets/images/blog1.png"
// import blog2 from "../../assets/images/blog2.png"
// import blog3 from "../../assets/images/blog3.png"

// const Blog = () => {
//   const blogs = [
//     {
//       id: 1,
//       title: "Creating Streamlined Safeguarding Processes with OneRen",
//       image: blog1,
//     },
//     {
//       id: 2,
//       title:
//         "What are your safeguarding responsibilities and how can you manage them?",
//       image: blog2,
//     },
//     {
//       id: 3,
//       title: "Revamping the Membership Model with Triathlon Australia",
//       image: blog3,
//     },
//   ];
//   return (
//     <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto my-12" >
//       <motion.div
//         variants={fadeIn("left", 0.2)}
//         initial="hidden"
//         whileInView={"show"}
//         viewport={{ once: false, amount: 0.6 }}
//         className="text-center md:w-1/2 mx-auto"
//       >
//         <h2 className="text-4xl text-neutralDGrey font-semibold mb-4">
//           Caring is the new marketing
//         </h2>
//         <p className="text-sm text-neutralGrey mb-8 md:w-3/4 mx-auto">
//           The Nexcent blog is the best place to read about the latest membership
//           insights, trends and more. See who is joining the community, read
//           about how our community are increasing their membership income and lot
//           is more.
//         </p>
//       </motion.div>

//       {/* all blogs */}
//       <motion.div
//         variants={fadeIn("right", 0.3)}
//         initial="hidden"
//         whileInView={"show"}
//         viewport={{ once: false, amount: 0.6 }}
//         className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 items-center justify-between mt-16"
//       >
//         {blogs.map((blog) => (
//           <div key={blog.id} className="mx-auto relative mb-12 cursor-pointer">
//             <img
//               src={blog.image}
//               alt=""
//               className="mx-auto hover:scale-95 transition-all duration-300"
//             />

//             <div className="text-center px-4 py-8 bg-white shadow-lg rounded-md md:w-3/4 mx-auto absolute -bottom-12 left-0 right-0">
//               <h3 className="mb-3 text-neutralGrey font-semibold">
//                 {blog.title}
//               </h3>
//               <div className="flex gap-8 items-center justify-center">
//                 <a
//                   href="/"
//                   className="font-bold text-brandPrimary hover:text-neutralBlack"
//                 >
//                   Meet all customers
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="17"
//                     height="11"
//                     viewBox="0 0 17 11"
//                     fill="none"
//                     className="inline-block ml-2"
//                   >
//                     <path
//                       d="M12 9.39905L15.2929 6.10615C15.6834 5.71563 15.6834 5.08246 15.2929 4.69194L12 1.39905M15 5.39905L1 5.39905"
//                       stroke="#4CAF4F"
//                     />
//                   </svg>
//                 </a>
//               </div>
//             </div>
//           </div>
//         ))}
//       </motion.div>
//     </div>
//   );
// };

// export default Blog;

// import { Card } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";
// motion
import { motion } from "framer-motion";
// variants
import { fadeIn } from "./variants";
import blog1 from "../../assets/images/blog1.png";
import blog2 from "../../assets/images/blog2.png";
import blog3 from "../../assets/images/blog3.png";

const Blog = () => {
  const history = useNavigate();

  const blogs = [
    {
      id: 1,
      title: "Cách mạng hóa Thanh toán Sự kiện với Hệ thống Sáng tạo",
      image: blog1,
    },
    {
      id: 2,
      title: "Giải pháp Thanh toán Tối ưu cho Sự kiện Quy mô Lớn",
      image: blog2,
    },
    {
      id: 3,
      title: "Nâng cao Trải nghiệm Người dùng với Tích hợp Thanh toán Mượt mà",
      image: blog3,
    },
  ];

  const handleBlogClick = (id) => {
    history.push(`/blog/${id}`);
  };

  return (
    <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto my-12">
      <motion.div
        variants={fadeIn("left", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.6 }}
        className="text-center md:w-1/2 mx-auto"
      >
        <h4 className="text-2xl text-neutralDGrey font-bold mb-4">
          TIN MỚI NHẤT
        </h4>
        <h2 className="text-4xl text-neutralGrey font-semibold mb-8 md:w-3/4 mx-auto">
          Từ Blog của Chúng Tôi
        </h2>
      </motion.div>

      {/* all blogs */}
      <motion.div
        variants={fadeIn("right", 0.3)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.6 }}
        className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 items-center justify-between mt-16"
      >
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="mx-auto relative mb-12 cursor-pointer"
            onClick={() => handleBlogClick(blog.id)}
          >
            <img
              src={blog.image}
              alt=""
              className="mx-auto hover:scale-95 transition-all duration-300"
            />
            <div className="text-center px-4 py-8 bg-white shadow-lg rounded-md md:w-3/4 mx-auto absolute -bottom-12 left-0 right-0">
              <h3 className="mb-3 text-neutralGrey font-semibold">
                {blog.title}
              </h3>
              <div className="flex gap-8 items-center justify-center">
                <a
                  href={`/blog/${blog.id}`}
                  className="font-bold text-brandPrimary hover:text-neutralBlack"
                >
                  Đọc Thêm
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="11"
                    viewBox="0 0 17 11"
                    fill="none"
                    className="inline-block ml-2"
                  >
                    <path
                      d="M12 9.39905L15.2929 6.10615C15.6834 5.71563 15.6834 5.08246 15.2929 4.69194L12 1.39905M15 5.39905L1 5.39905"
                      stroke="#4CAF4F"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Blog;
