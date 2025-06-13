'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLoading } from '@/components/layout/Loading';

export default function PrivacyPage() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true, '개인정보처리방침 페이지 로딩 중');
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [setLoading]);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">개인정보처리방침</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">1. 개인정보의 수집 및 이용 목적</h2>
              <p className="text-gray-600">
                잡코리아 빌보드(이하 '회사')는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc list-inside mt-3 text-gray-600 space-y-1">
                <li>회원 가입 및 관리</li>
                <li>서비스 제공 및 운영</li>
                <li>마케팅 및 광고에의 활용 (이벤트 정보 및 참여기회 제공, 광고성 정보 제공 등)</li>
                <li>서비스 이용 통계 및 분석</li>
                <li>프리랜서와 기업 간 매칭 서비스 제공</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">2. 수집하는 개인정보 항목</h2>
              <p className="text-gray-600">
                회사는 서비스 제공을 위해 다음과 같은 개인정보 항목을 수집하고 있습니다.
              </p>
              <div className="mt-3 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">필수항목</h3>
                  <ul className="list-disc list-inside mt-1 text-gray-600 space-y-1">
                    <li>이메일 주소, 비밀번호, 이름, 휴대폰 번호</li>
                    <li>서비스 이용 기록, 접속 로그, 접속 IP 정보, 쿠키, 불량 이용 기록</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">선택항목</h3>
                  <ul className="list-disc list-inside mt-1 text-gray-600 space-y-1">
                    <li>프로필 사진, 학력, 경력사항, 자격증, 포트폴리오</li>
                    <li>주소, 생년월일, 성별</li>
                    <li>SNS 계정 정보(소셜 로그인 시)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">3. 개인정보의 보유 및 이용기간</h2>
              <p className="text-gray-600">
                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
              <ul className="list-disc list-inside mt-3 text-gray-600 space-y-1">
                <li>회원 가입 및 관리: 회원탈퇴 시까지</li>
                <li>다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지</li>
                <li>관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지</li>
                <li>서비스 이용에 따른 채권·채무관계 잔존 시에는 해당 채권·채무관계 정산 시까지</li>
              </ul>
              <p className="text-gray-600 mt-3">
                전자상거래 등에서의 소비자 보호에 관한 법률, 통신비밀보호법 등 관련 법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 관련 법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">4. 개인정보의 제3자 제공</h2>
              <p className="text-gray-600">
                회사는 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
              </p>
              <p className="text-gray-600 mt-3">
                회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다.
              </p>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">제공받는 자: 프로젝트 등록 기업</h3>
                <p className="text-gray-600 mt-2">
                  - 제공 목적: 프리랜서와 기업 간 프로젝트 매칭 서비스 제공<br />
                  - 제공 항목: 이름, 이메일, 경력사항, 기술스택, 포트폴리오<br />
                  - 보유 기간: 프로젝트 완료 후 3개월까지
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">5. 정보주체의 권리, 의무 및 행사방법</h2>
              <p className="text-gray-600">
                정보주체는 회사에 대해 언제든지 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다.
              </p>
              <p className="text-gray-600 mt-3">
                권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.
              </p>
              <p className="text-gray-600 mt-3">
                정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">6. 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항</h2>
              <p className="text-gray-600">
                회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
              </p>
              <p className="text-gray-600 mt-3">
                쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 브라우저에 보내는 소량의 정보이며 이용자들의 PC 컴퓨터 내의 하드디스크에 저장되기도 합니다.
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">① 쿠키의 사용목적</span><br />
                  회원과 비회원의 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과 관심분야를 파악 및 자취 추적, 각종 이벤트 참여 정도 및 방문 회수 파악 등을 통한 타겟 마케팅 및 개인 맞춤 서비스 제공
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">② 쿠키 설정 거부 방법</span><br />
                  이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">7. 개인정보 보호책임자</h2>
              <p className="text-gray-600">
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-medium">▶ 개인정보 보호책임자</span><br />
                  성명: 김정보<br />
                  직책: 개인정보보호팀장<br />
                  연락처: 02-1234-5678, privacy@billboard.jobkorea.co.kr
                </p>
              </div>
              <p className="text-gray-600 mt-3">
                정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">8. 개인정보 처리방침 변경</h2>
              <p className="text-gray-600">
                이 개인정보 처리방침은 2024년 03월 01일부터 적용됩니다.
              </p>
              <p className="text-gray-600 mt-3">
                이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                <li>2023년 09월 01일 ~ 2024년 02월 29일 적용 (이전 버전 보기)</li>
                <li>2022년 05월 01일 ~ 2023년 08월 31일 적용 (이전 버전 보기)</li>
              </ul>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 