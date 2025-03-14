'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';

declare global {
  interface Window {
    daum: any;
  }
}

interface FormDataType {
  userId: string;
  password: string;
  passwordConfirm: string;
  name: string;
  businessNumber: {
    first: string;
    middle: string;
    last: string;
  };
  manager: string;
  phone: {
    first: string;
    middle: string;
    last: string;
  };
  email: {
    id: string;
    domain: string;
  };
  business: {
    type: string;
    description: string;
  };
  postCode: {
    first: string;
    last: string;
  };
  address: {
    basic: string;
    detail: string;
  };
  documents: File[];
}

export default function RegisterPage() {
  const [formType, setFormType] = useState<'company' | 'individual'>('company');
  const [formData, setFormData] = useState<FormDataType>({
    userId: '',
    password: '',
    passwordConfirm: '',
    name: '',
    businessNumber: {
      first: '',
      middle: '',
      last: '',
    },
    manager: '',
    phone: {
      first: '010',
      middle: '',
      last: '',
    },
    email: {
      id: '',
      domain: 'huware.com',
    },
    business: {
      type: 'SW 공급',
      description: 'SW 공급',
    },
    postCode: {
      first: '',
      last: '',
    },
    address: {
      basic: '서울시 마포구 동교동',
      detail: '159-6 파라다이스빌 705호',
    },
    documents: [] as File[],
  });
  
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // name이 점(.)을 포함하는 경우 (예: phone.first)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => {
        const parentObj = prev[parent as keyof FormDataType] as Record<string, any>;
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value,
          },
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 업종과 사업내용 필드 수정
  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      business: {
        ...prev.business,
        [name]: value,
      },
    }));
  };

  // 다음 주소 검색 API 스크립트 로드 감지
  useEffect(() => {
    const handleScriptLoad = () => {
      if (window.daum && window.daum.Postcode) {
        setIsScriptLoaded(true);
      }
    };

    if (window.daum && window.daum.Postcode) {
      setIsScriptLoaded(true);
    } else {
      // Script 태그 로드 완료 감지를 위한 이벤트 리스너
      window.addEventListener('load', handleScriptLoad);
      return () => {
        window.removeEventListener('load', handleScriptLoad);
      };
    }
  }, []);

  // 다음 주소 검색 API를 사용하여 주소 검색
  const openAddressSearch = () => {
    if (!isScriptLoaded) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: function(data: any) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드
        const fullAddress = data.address;
        const zoneCode = data.zonecode;
        
        // 우편번호 5자리를 앞 3자리와 뒤 2자리로 분리
        const postcodeFirst = zoneCode.substring(0, 3);
        const postcodeLast = zoneCode.substring(3);
        
        setFormData(prev => ({
          ...prev,
          postCode: {
            first: postcodeFirst,
            last: postcodeLast,
          },
          address: {
            ...prev.address,
            basic: fullAddress,
          }
        }));

        // 상세주소 입력란에 포커스 주기
        setTimeout(() => {
          const detailInput = document.querySelector('input[name="address.detail"]') as HTMLInputElement;
          if (detailInput) {
            detailInput.focus();
          }
        }, 100);
      },
      // 팝업 가운데 정렬
      theme: {
        bgColor: "#FFFFFF", // 팝업 배경색
        searchBgColor: "#4A8AF4", // 검색창 배경색
        contentBgColor: "#FFFFFF", // 본문 배경색
        pageBgColor: "#FAFAFA", // 페이지 배경색
        textColor: "#333333", // 기본 글자색
        queryTextColor: "#FFFFFF", // 검색창 글자색
        postcodeTextColor: "#FF0071", // 우편번호 글자색
        emphTextColor: "#4A8AF4", // 강조 글자색
        outlineColor: "#DDDDDD" // 테두리
      },
      width: '500px',
      height: '500px'
    }).open({
      left: (window.innerWidth - 500) / 2,
      top: (window.innerHeight - 500) / 2
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입 로직 구현
    console.log('폼 제출됨:', formData);
    alert('회원가입이 요청되었습니다.');
  };

  // 기업 회원가입 폼 렌더링
  const renderCompanyForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 아이디 */}
      <div className="flex items-center gap-4">
        <label className="w-32">회원 아이디 (*)</label>
        <div className="flex-1">
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            placeholder="admin"
          />
          <button type="button" className="mt-2 text-blue-500 text-sm">
            중복검색
          </button>
        </div>
      </div>

      {/* 비밀번호 */}
      <div className="flex items-center gap-4">
        <label className="w-32">비밀번호 (*)</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="flex-1 border rounded p-2"
          placeholder="******"
        />
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex items-center gap-4">
        <label className="w-32">비밀번호 확인 (*)</label>
        <input
          type="password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleInputChange}
          className="flex-1 border rounded p-2"
          placeholder="******"
        />
      </div>

      {/* 업체명 */}
      <div className="flex items-center gap-4">
        <label className="w-32">업체명 (*)</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="flex-1 border rounded p-2"
          placeholder="휴웨어"
        />
      </div>

      {/* 사업자등록번호 */}
      <div className="flex items-center gap-4">
        <label className="w-32">사업자등록번호 (*)</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="businessNumber.first"
            value={formData.businessNumber.first}
            onChange={handleInputChange}
            className="w-24 border rounded p-2"
            placeholder="123"
          />
          <span className="flex items-center">-</span>
          <input
            type="text"
            name="businessNumber.middle"
            value={formData.businessNumber.middle}
            onChange={handleInputChange}
            className="w-24 border rounded p-2"
            placeholder="456"
          />
          <span className="flex items-center">-</span>
          <input
            type="text"
            name="businessNumber.last"
            value={formData.businessNumber.last}
            onChange={handleInputChange}
            className="w-24 border rounded p-2"
            placeholder="789"
          />
        </div>
      </div>

      {/* 담당자명 */}
      <div className="flex items-center gap-4">
        <label className="w-32">담당자명 (*)</label>
        <input
          type="text"
          name="manager"
          value={formData.manager}
          onChange={handleInputChange}
          className="flex-1 border rounded p-2"
          placeholder="홍길동"
        />
      </div>

      {/* 휴대폰 번호 */}
      <div className="flex items-center gap-4">
        <label className="w-32">휴대폰 번호 (*)</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="phone.first"
            value={formData.phone.first}
            onChange={handleInputChange}
            className="w-24 border rounded p-2"
          />
          <span className="flex items-center">-</span>
          <input
            type="text"
            name="phone.middle"
            value={formData.phone.middle}
            onChange={handleInputChange}
            className="w-24 border rounded p-2"
          />
          <span className="flex items-center">-</span>
          <input
            type="text"
            name="phone.last"
            value={formData.phone.last}
            onChange={handleInputChange}
            className="w-24 border rounded p-2"
          />
        </div>
      </div>

      {/* 이메일 */}
      <div className="flex items-center gap-4">
        <label className="w-32">이메일</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="email.id"
            value={formData.email.id}
            onChange={handleInputChange}
            className="w-32 border rounded p-2"
          />
          <span>@</span>
          <input
            type="text"
            name="email.domain"
            value={formData.email.domain}
            readOnly
            className="w-32 border rounded p-2"
          />
        </div>
      </div>

      {/* 업종 */}
      <div className="flex items-center gap-4">
        <label className="w-32">업종</label>
        <input
          type="text"
          name="type"
          value={formData.business.type}
          onChange={handleBusinessChange}
          className="flex-1 border rounded p-2"
        />
      </div>

      {/* 사업내용 */}
      <div className="flex items-center gap-4">
        <label className="w-32">사업내용</label>
        <input
          type="text"
          name="description"
          value={formData.business.description}
          onChange={handleBusinessChange}
          className="flex-1 border rounded p-2"
        />
      </div>

      {/* 우편번호 */}
      <div className="flex items-center gap-4">
        <label className="w-32">우편번호</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="postCode.first"
            value={formData.postCode.first}
            onChange={handleInputChange}
            className="w-24 border rounded p-2 bg-gray-50"
            readOnly
          />
          <span className="flex items-center">-</span>
          <input
            type="text"
            name="postCode.last"
            value={formData.postCode.last}
            onChange={handleInputChange}
            className="w-24 border rounded p-2 bg-gray-50"
            readOnly
          />
          <button 
            type="button" 
            className="ml-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={openAddressSearch}
          >
            우편번호검색
          </button>
        </div>
      </div>

      {/* 주소 */}
      <div className="flex items-center gap-4">
        <label className="w-32">주소</label>
        <input
          type="text"
          name="address.basic"
          value={formData.address.basic}
          onChange={handleInputChange}
          className="flex-1 border rounded p-2 bg-gray-50"
          readOnly
        />
      </div>

      {/* 상세 주소 */}
      <div className="flex items-center gap-4">
        <label className="w-32">상세 주소</label>
        <input
          type="text"
          name="address.detail"
          value={formData.address.detail}
          onChange={handleInputChange}
          className="flex-1 border rounded p-2"
          placeholder="상세 주소를 입력하세요"
        />
      </div>

      {/* 관련문서 업로드 */}
      <div className="flex items-start gap-4">
        <label className="w-32 pt-2">관련문서 업로드</label>
        <div className="flex-1">
          <div className="border rounded p-4 mb-2">
            <p className="text-sm text-gray-600 mb-2">
              (최대 5개까지 등록 가능합니다. 회사소개서, 사업자등록증 등)
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span>1.</span>
                <span className="text-sm">사업자등록증.jpg</span>
                <button type="button" className="text-red-500 text-sm">
                  [삭제]
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span>2.</span>
                <span className="text-sm">회사소개서.ppt</span>
                <button type="button" className="text-red-500 text-sm">
                  [삭제]
                </button>
              </div>
            </div>
          </div>
          <button type="button" className="text-blue-500">
            찾아보기
          </button>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          수정
        </button>
        <Link
          href="/"
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition inline-flex items-center justify-center"
        >
          취소
        </Link>
      </div>
    </form>
  );

  // 개인 회원가입 폼 렌더링 (예시, 필요에 따라 구현)
  const renderIndividualForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 아이디 */}
      <div className="flex items-center gap-4">
        <label className="w-32">회원 아이디 (*)</label>
        <div className="flex-1">
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            placeholder="아이디 입력"
          />
          <button type="button" className="mt-2 text-blue-500 text-sm">
            중복검색
          </button>
        </div>
      </div>

      {/* 비밀번호 */}
      <div className="flex items-center gap-4">
        <label className="w-32">비밀번호 (*)</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="flex-1 border rounded p-2"
          placeholder="******"
        />
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex items-center gap-4">
        <label className="w-32">비밀번호 확인 (*)</label>
        <input
          type="password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleInputChange}
          className="flex-1 border rounded p-2"
          placeholder="******"
        />
      </div>

      {/* 이름 */}
      <div className="flex items-center gap-4">
        <label className="w-32">이름 (*)</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="flex-1 border rounded p-2"
          placeholder="홍길동"
        />
      </div>

      {/* 생년월일 */}
      <div className="flex items-center gap-4">
        <label className="w-32">생년월일 (*)</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="birthYear"
            placeholder="1990"
            className="w-24 border rounded p-2"
          />
          <span className="flex items-center">년</span>
          <input
            type="text"
            name="birthMonth"
            placeholder="01"
            className="w-16 border rounded p-2"
          />
          <span className="flex items-center">월</span>
          <input
            type="text"
            name="birthDay"
            placeholder="01"
            className="w-16 border rounded p-2"
          />
          <span className="flex items-center">일</span>
        </div>
      </div>

      {/* 성별 */}
      <div className="flex items-center gap-4">
        <label className="w-32">성별 (*)</label>
        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              className="mr-2"
            />
            <label htmlFor="male">남성</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              className="mr-2"
            />
            <label htmlFor="female">여성</label>
          </div>
        </div>
      </div>

      {/* 휴대폰 번호 */}
      <div className="flex items-center gap-4">
        <label className="w-32">휴대폰 번호 (*)</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="phone.first"
            value={formData.phone.first}
            onChange={handleInputChange}
            className="w-24 border rounded p-2"
          />
          <span className="flex items-center">-</span>
          <input
            type="text"
            name="phone.middle"
            value={formData.phone.middle}
            onChange={handleInputChange}
            className="w-24 border rounded p-2"
          />
          <span className="flex items-center">-</span>
          <input
            type="text"
            name="phone.last"
            value={formData.phone.last}
            onChange={handleInputChange}
            className="w-24 border rounded p-2"
          />
        </div>
      </div>

      {/* 이메일 */}
      <div className="flex items-center gap-4">
        <label className="w-32">이메일</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="email.id"
            value={formData.email.id}
            onChange={handleInputChange}
            className="w-32 border rounded p-2"
          />
          <span>@</span>
          <input
            type="text"
            name="email.domain"
            value={formData.email.domain}
            onChange={handleInputChange}
            className="w-32 border rounded p-2"
          />
          <select
            className="border rounded p-2"
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                const event = {
                  target: {
                    name: 'email.domain',
                    value
                  }
                } as React.ChangeEvent<HTMLInputElement>;
                handleInputChange(event);
              }
            }}
          >
            <option value="">직접입력</option>
            <option value="gmail.com">gmail.com</option>
            <option value="naver.com">naver.com</option>
            <option value="daum.net">daum.net</option>
            <option value="hanmail.net">hanmail.net</option>
          </select>
        </div>
      </div>

      {/* 우편번호 */}
      <div className="flex items-center gap-4">
        <label className="w-32">우편번호</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="postCode.first"
            value={formData.postCode.first}
            onChange={handleInputChange}
            className="w-24 border rounded p-2 bg-gray-50"
            readOnly
          />
          <span className="flex items-center">-</span>
          <input
            type="text"
            name="postCode.last"
            value={formData.postCode.last}
            onChange={handleInputChange}
            className="w-24 border rounded p-2 bg-gray-50"
            readOnly
          />
          <button 
            type="button" 
            className="ml-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={openAddressSearch}
          >
            우편번호검색
          </button>
        </div>
      </div>

      {/* 주소 */}
      <div className="flex items-center gap-4">
        <label className="w-32">주소</label>
        <input
          type="text"
          name="address.basic"
          value={formData.address.basic}
          onChange={handleInputChange}
          className="flex-1 border rounded p-2 bg-gray-50"
          readOnly
        />
      </div>

      {/* 상세 주소 */}
      <div className="flex items-center gap-4">
        <label className="w-32">상세 주소</label>
        <input
          type="text"
          name="address.detail"
          value={formData.address.detail}
          onChange={handleInputChange}
          className="flex-1 border rounded p-2"
          placeholder="상세 주소를 입력하세요"
        />
      </div>

      {/* 정보 수신 동의 */}
      <div className="flex items-start gap-4">
        <label className="w-32 pt-2">정보 수신 동의</label>
        <div className="flex-1 space-y-2">
          <div className="flex items-center">
            <input type="checkbox" id="emailAgree" className="mr-2" />
            <label htmlFor="emailAgree">이메일 수신에 동의합니다</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="smsAgree" className="mr-2" />
            <label htmlFor="smsAgree">SMS 수신에 동의합니다</label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ※ 위 정보 수신에 동의하지 않으셔도 회원가입이 가능합니다.
          </p>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          가입하기
        </button>
        <Link
          href="/"
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition inline-flex items-center justify-center"
        >
          취소
        </Link>
      </div>
    </form>
  );

  return (
    <>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="beforeInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />
        
      <div className="w-full h-full min-h-screen bg-gray-50 px-4 py-8">
        <div className="flex flex-col lg:flex-row max-w-[1252px] mx-auto relative">
          {/* 왼쪽 사이드바 (고정 위치) */}
          <div className="w-full lg:w-64 mb-6 lg:mb-0">
            <div className="lg:fixed lg:w-60 bg-white shadow-md rounded-lg z-20">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-2">회원가입 유형</h3>
                <p className="text-sm text-gray-600">원하시는 회원 유형을 선택해주세요</p>
              </div>
              <div className="p-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setFormType('company')}
                  className={`w-full py-3 px-3 rounded-md font-bold text-left transition-all duration-200 flex items-center ${
                    formType === 'company' 
                      ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  기업 회원가입
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('individual')}
                  className={`w-full py-3 px-3 rounded-md font-bold text-left transition-all duration-200 flex items-center ${
                    formType === 'individual' 
                      ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  개인 회원가입
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-b-lg">
                <p className="text-xs text-gray-500">회원가입 후 다양한 서비스를 이용하실 수 있습니다.</p>
              </div>
            </div>
          </div>
          
          {/* 메인 콘텐츠 영역 (사이드바 너비만큼 마진 추가) */}
          <div className="flex-1 w-full lg:pl-64">
            <div className="bg-white rounded-lg p-5 lg:p-7 shadow-md h-full pr-2">
              <h2 className="text-xl lg:text-2xl font-bold mb-6">
                {formType === 'company' ? '기업 회원가입' : '개인 회원가입'}
              </h2>
              
              {formType === 'company' && (
                <p className="text-gray-600 mb-6 text-sm">
                  (*)표시는 필수입력 사항입니다. 입력하신 정보는 프로젝트 등록 시 자동 입력됩니다
                </p>
              )}

              {formType === 'company' ? renderCompanyForm() : renderIndividualForm()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 