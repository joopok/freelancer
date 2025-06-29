#!/usr/bin/env node

// MariaDB 연결 테스트 스크립트
// 사용법: node test-database.js

const mariadb = require('mariadb');

async function testConnection() {
  let conn;
  try {
    console.log('🔍 MariaDB 연결 테스트를 시작합니다...');
    const dbConfig = {
      host: '192.168.0.109',
      port: 3306,
      user: 'root',
      password: '~Asy10131227', // 사용자가 설정한 비밀번호
      database: 'jobtracker',   // 사용자가 설정한 데이터베이스명
      connectTimeout: 10000,
      connectionLimit: 10
    };
    
    console.log('📋 연결 설정:');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Port: ${dbConfig.port}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log(`   Database: ${dbConfig.database}`);

    console.log('\n1️⃣ 연결 풀 생성 중...');
    const pool = mariadb.createPool(dbConfig);
    console.log('✅ 연결 풀 생성 성공');
    
    console.log('\n2️⃣ 데이터베이스 연결 중...');
    conn = await pool.getConnection();
    console.log('✅ 데이터베이스 연결 성공!');

    console.log('\n3️⃣ 테스트 쿼리 실행 중...');
    const rows = await conn.query('SELECT 1 as val');
    console.log('✅ 테스트 쿼리 성공!');
    console.log('   Query Result:', rows);

  } catch (err) {
    console.error('❌ 데이터베이스 연결 실패:\n');
    console.error(`🔴 알 수 없는 오류: ${err.message}`);
    // console.error(`   전체 오류: ${err.stack}`); // 스택 트레이스는 너무 길어서 주석 처리
    console.log(`
📚 도움말:
- DATABASE_SETUP.md 파일을 참조하세요
- MariaDB 설치: https://mariadb.org/download/
- 문제가 지속되면 이슈를 생성해주세요`);
  } finally {
    if (conn) {
      await conn.release();
      console.log('🔧 연결이 정상적으로 해제되었습니다.');
    }
    // In this script, the pool is created but not explicitly closed.
    // For a single test run, the process will exit and close the pool.
    // In a real application, you'd manage the pool lifecycle.
    console.log('🏁 테스트 완료.');
  }
}

testConnection();

module.exports = { testConnection }; 