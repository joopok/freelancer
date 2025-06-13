'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLoading } from '@/components/layout/Loading';

export default function TermsPage() {
  const { setLoading } = useLoading();
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    setLoading(true, '이용약관 페이지 로딩 중');
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [setLoading]);

  const tabs = [
    { id: 'general', label: '일반 이용약관' },
    { id: 'membership', label: '회원 이용약관' },
    { id: 'payment', label: '결제 이용약관' },
  ];

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
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">이용약관</h1>
        
        {/* 탭 네비게이션 */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex flex-wrap -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-block py-4 px-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
                } focus:outline-none transition-colors`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 약관 내용 */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">제 1 장 총칙</h2>
              
              <div className="space-y-4">
                <section>
                  <h3 className="text-lg font-semibold text-gray-800">제 1 조 (목적)</h3>
                  <p className="text-gray-600 mt-2">
                    이 약관은 잡코리아 빌보드(이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold text-gray-800">제 2 조 (정의)</h3>
                  <p className="text-gray-600 mt-2">
                    이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>"서비스"란 회사가 제공하는 모든 서비스를 의미합니다.</li>
                    <li>"회원"이란 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고, 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
                    <li>"아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인하는 문자와 숫자의 조합을 말합니다.</li>
                    <li>"비밀번호"란 회원의 정보 보호를 위해 회원 자신이 설정한 문자와 숫자의 조합을 말합니다.</li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold text-gray-800">제 3 조 (약관의 효력 및 변경)</h3>
                  <p className="text-gray-600 mt-2">
                    ① 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.<br />
                    ② 회사는 "약관의 규제에 관한 법률", "정보통신망 이용촉진 및 정보보호 등에 관한 법률" 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.<br />
                    ③ 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다. 다만, 회원에게 불리한 약관의 개정의 경우에는 30일 이전부터 공지합니다.<br />
                    ④ 회원은 개정된 약관에 동의하지 않을 경우 회원 탈퇴를 요청할 수 있으며, 개정된 약관의 효력 발생일로부터 7일 이후에도 거부의사를 표시하지 않고 서비스를 계속 이용할 경우 약관의 개정 내용에 동의한 것으로 간주됩니다.
                  </p>
                </section>
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 mt-8">제 2 장 서비스 이용</h2>
              
              <div className="space-y-4">
                <section>
                  <h3 className="text-lg font-semibold text-gray-800">제 4 조 (서비스의 제공)</h3>
                  <p className="text-gray-600 mt-2">
                    ① 회사는 다음과 같은 서비스를 제공합니다.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>프리랜서 및 기업 회원 간의 프로젝트 매칭 서비스</li>
                    <li>프로젝트 등록 및 검색 서비스</li>
                    <li>프리랜서 프로필 등록 및 검색 서비스</li>
                    <li>기타 회사가 정하는 서비스</li>
                  </ul>
                  <p className="text-gray-600 mt-2">
                    ② 회사는 서비스를 일정범위로 분할하여 각 범위 별로 이용가능시간을 별도로 지정할 수 있습니다. 다만, 이러한 경우에는 그 내용을 사전에 공지합니다.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold text-gray-800">제 5 조 (서비스의 중단)</h3>
                  <p className="text-gray-600 mt-2">
                    ① 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 또는 운영상 상당한 이유가 있는 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.<br />
                    ② 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, 회사가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
                  </p>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'membership' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">제 1 장 회원 가입 및 관리</h2>
              
              <div className="space-y-4">
                <section>
                  <h3 className="text-lg font-semibold text-gray-800">제 1 조 (회원가입)</h3>
                  <p className="text-gray-600 mt-2">
                    ① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.<br />
                    ② 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.<br />
                    1. 가입신청자가 이 약관 제6조 제3항에 의하여 이전에 회원자격을 상실한 적이 있는 경우<br />
                    2. 등록 내용에 허위, 기재누락, 오기가 있는 경우<br />
                    3. 기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우<br />
                    ③ 회원가입계약의 성립 시기는 회사의 승낙이 회원에게 도달한 시점으로 합니다.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold text-gray-800">제 2 조 (회원 탈퇴 및 자격 상실)</h3>
                  <p className="text-gray-600 mt-2">
                    ① 회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시 회원탈퇴를 처리합니다.<br />
                    ② 회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다.<br />
                    1. 가입 신청 시에 허위 내용을 등록한 경우<br />
                    2. 다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우<br />
                    3. 서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우<br />
                    ③ 회사가 회원 자격을 제한·정지 시킨 후, 동일한 행위가 2회 이상 반복되거나 30일 이내에 그 사유가 시정되지 아니하는 경우 회사는 회원자격을 상실시킬 수 있습니다.
                  </p>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">제 1 장 결제 및 환불</h2>
              
              <div className="space-y-4">
                <section>
                  <h3 className="text-lg font-semibold text-gray-800">제 1 조 (결제방법)</h3>
                  <p className="text-gray-600 mt-2">
                    ① 회사에서 구매한 서비스의 대금 지급방법은 다음 각 호의 방법 중 가용한 방법으로 할 수 있습니다. 단, 회사는 서비스의 특성에 따라 대금 지급방법을 제한할 수 있습니다.<br />
                    1. 신용카드 결제<br />
                    2. 계좌이체<br />
                    3. 회사가 계약을 맺었거나 회사가 인정한 상품권에 의한 결제<br />
                    4. 기타 전자적 지급방법에 의한 대금 지급 등
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold text-gray-800">제 2 조 (환불규정)</h3>
                  <p className="text-gray-600 mt-2">
                    ① 회원이 구매한 서비스의 환불은 다음과 같은 규정에 따릅니다.<br />
                    1. 서비스 이용 전 환불 요청 시: 전액 환불<br />
                    2. 서비스 이용 개시 후 7일 이내 환불 요청 시: 이용일수에 해당하는 금액을 차감한 나머지 금액 환불<br />
                    3. 서비스 이용 개시 후 7일 초과 시: 환불 불가<br />
                    ② 회사의 서비스 중단, 장애 등 회사의 귀책사유로 인한 서비스 이용 불가 시에는 이용 불가 기간만큼 이용기간을 연장하거나 환불합니다.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold text-gray-800">제 3 조 (과오금)</h3>
                  <p className="text-gray-600 mt-2">
                    ① 회사는 과오금이 발생한 경우 이를 회원에게 통지하고, 회원이 과오금에 대해 이의를 제기하지 않는 경우 과오금을 환불합니다.<br />
                    ② 회사는 과오금의 환불절차를 디지털콘텐츠이용자보호지침에 따라 처리합니다.
                  </p>
                </section>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* 약관 동의 일자 */}
        <p className="text-sm text-gray-500 mt-8 text-center">
          본 약관은 2024년 03월 01일부터 시행됩니다.
        </p>
      </motion.div>
    </div>
  );
} 