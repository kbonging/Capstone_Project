import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import mainLogo from "../images/main_logo.png";

//애니메이션 설정 코드
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden">
        <img
          src="https://source.unsplash.com/1600x900/?abstract,technology"
          alt="사진 만들어서 적용할 예정인 배경"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/60 to-purple-500/60 dark:from-indigo-700/60 dark:to-purple-700/60"></div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative z-10 px-6"
        >
          <img src={mainLogo} alt="Revory 로고" className="mx-auto w-32 h-auto mb-6 drop-shadow-lg" />
          <h1 className="text-5xl font-extrabold mb-4 text-white drop-shadow-lg">
            Review + Memory = <span className="text-yellow-300">Revory</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/90 leading-relaxed">
            체험단과 브랜드를 연결해 경험을 <strong>추억</strong>으로 남기는
            새로운 리뷰 중개 플랫폼
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            우리의 미션 & 비전
          </h2>
          <p className="max-w-3xl mx-auto text-center text-lg leading-relaxed mb-12">
            Revory는 단순히 체험단을 모집하는 플랫폼이 아닙니다.  
            브랜드와 리뷰어가 함께 성장하며, 리뷰가 하나의 <strong>기억</strong>으로
            오래 남도록 돕습니다.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "신뢰", desc: "투명하고 안전한 프로세스로 브랜드와 리뷰어 모두가 안심할 수 있습니다." },
              { title: "창의성", desc: "다양한 체험 기회를 통해 창의적인 콘텐츠가 탄생합니다." },
              { title: "성장", desc: "브랜드와 리뷰어가 함께 성장하는 지속 가능한 생태계를 만듭니다." },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-700 p-8 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                  {item.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-200">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Services */}
      <section className="bg-gray-50 dark:bg-zinc-800 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl font-bold text-center mb-12"
          >
            주요 서비스
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "체험단 매칭", desc: "브랜드와 리뷰어를 스마트하게 연결해 빠른 협업을 지원합니다." },
              { title: "리뷰 관리", desc: "사진, 영상, 텍스트 리뷰를 체계적으로 관리하고 확인할 수 있습니다." },
              { title: "데이터 인사이트", desc: "캠페인 성과를 분석하고 다음 마케팅 전략을 위한 인사이트를 제공합니다." },
            ].map((service) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true }}
                className="p-8 bg-white dark:bg-zinc-700 rounded-2xl shadow hover:-translate-y-1 transition-transform"
              >
                <h3 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                  {service.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-200">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW : Our Team Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl font-bold text-center mb-12"
        >
          Revory를 만드는 사람들
        </motion.h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { name: "김준영", role: "Backend Developer", img: "https://source.unsplash.com/200x200/?portrait,man" },
            { name: "김봉중", role: "Frontend Developer", img: "https://source.unsplash.com/200x200/?portrait,boy" },
            { name: "최재혁", role: "UI/UX Designer", img: "https://source.unsplash.com/200x200/?portrait,girl" },
            { name: "바하", role: "Project Lead", img: "https://source.unsplash.com/200x200/?portrait,woman" },
          ].map((member) => (
            <motion.div
              key={member.name}
              variants={fadeUp}
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-32 h-32 object-cover rounded-full shadow mb-4"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-indigo-600 dark:text-indigo-400">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl font-bold mb-4"
        >
          Revory와 함께 하시겠어요?
        </motion.h2>
        <p className="mb-8 text-lg">
          지금 바로 브랜드와 리뷰어가 함께하는 특별한 경험을 시작해 보세요.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-4 text-white font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition"
        >
          가입하기
        </Link>
      </section>
    </div>
  );
}
