const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function checkCopy() {
  const read = (lang, route) => fs.readFileSync(path.join(__dirname, lang, route + '.html'), 'utf8');
  for (const lang of ['', 'ko']) {
    const home = read(lang, 'index');
    for (const filler of ['The work behind', 'a few seconds', 'Find the moments around the hardware', 'The flight is one moment', '짧은 비행을 만드는', '긴 시간의 연구', '한 번의 비행은', '어떤 질문을 탐구할까요', '무슨 일이 있었을까']) {
      assert.ok(!home.includes(filler), `Remove empty framing: ${filler}`);
    }
    const pslv = read(lang, 'projects');
    const news = read(lang, 'gallery');
    const detailCaption = lang ? '발사 레일에 설치된 PSI 로켓 동체.' : 'The PSI rocket body on the launch rail.';
    for (const page of [home, news]) assert.ok(page.includes(detailCaption), 'Rocket close-up has a concrete bilingual description');
    assert.ok(news.includes(lang ? 'PSI 아카이브의 사진입니다.' : 'Photographs from the PSI archive.'));
    assert.ok(!news.includes('archive previews') && !news.includes('미리보기 이미지로 확보'), 'Archive credit excludes acquisition narration');
    for (const fact of ['Portenta H7','GNSS','323.79 N','484.66 N s','2331.2 ms','38.018 bar']) assert.ok(pslv.includes(fact),`Retain essential hardware and measured result: ${fact}`);
    assert.ok(pslv.includes(lang ? 'GNSS 위치는 별도로 기록하며 이 수직 필터의 입력으로 사용하지 않습니다' : 'GNSS position is logged separately and does not feed this vertical filter'));
    assert.ok(!pslv.includes('Implementation references')&&!pslv.includes('구현 참고 자료'));
    const about = read(lang, 'about');
    assert.ok(!home.includes('data-program-choice'),'Homepage no longer offers a second project-switch control');
    assert.ok(!about.includes(lang ? '가입과 활동 과정' : 'Joining and participating'));
    assert.ok(!about.includes(lang ? '가입 관련 질문' : 'Membership questions'));
    assert.ok(!about.includes(lang ? '교육과 노트북' : 'Education and notebooks'));
    if(!lang){
      assert.match(home,/programme/,'Use British programme in editorial copy');
      assert.doesNotMatch([home,pslv,news,about].join(' '),/\b(?:rocket|PSLV) program\b/i);
    }
    for (const name of ['Uikang Joo', 'Yeonho Kim', 'Taeho Lee', 'Jaeyoung Park', 'Jin-Tae Kim', 'Un-Seong Baik', 'Minsoo Kim', 'President', 'Vice President', 'Secretary', 'Avionics & TMS Lead', 'Faculty advisor']) assert.ok(about.includes(name), `Retain ${name}`);
    assert.ok(about.includes(lang ? '역대 회장' : 'Former presidents'));
    assert.ok(!about.includes('organisation-table'),'The removed organisation table stays absent');
    const support = about;
    assert.equal((about.match(/class="supporter-list"/g)||[]).length,1,'Combined page has one supporter list');
    for(const file of ['supporter-postech.png','supporter-kai-light.png','supporter-kai-dark.png','supporter-mathworks-light.png','supporter-mathworks-dark.png','supporter-ansys.png'])assert.ok(support.includes(file),'Render official supporter logos on Support');
    assert.ok(support.includes('https://me.postech.ac.kr/ko/'),'Mechanical Engineering retains its own supporter entry with the high-resolution POSTECH wordmark');
    const research = read(lang, 'research');
    assert.match(research, lang ? /통계적 유의성은 확인되지/ : /statistical significance is not established/);
    assert.match(research, lang ? /게재 확정·출판 여부는 확인되지/ : /Acceptance and publication status have not been verified/);
    const records = read(lang, 'records');
    assert.ok(records.includes(lang ? '발사 성공, 회수 실패.' : 'Launch successful, recovery failed.'));
    for (const date of ['2025-08-09', '2025-12-05', '2026-02-06']) assert.ok(records.includes(date));
  }
  console.log('PASS: bilingual copy cleanup and essential engineering, people, dates and research uncertainty');
}
if (require.main === module) checkCopy();
module.exports = {checkCopy};
