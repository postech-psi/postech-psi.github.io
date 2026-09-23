import {resultCatalog} from './test-results-view.mjs';
export const routes = ['index','projects','pslv','aircraft','research','records','learning','about','news','join','gallery','avionics','tms','support'];
export const text = (en,ko) => ({en,ko});
export const sources = {
  presidentEmail:'uikangee@postech.ac.kr',
  github:'https://github.com/postech-psi', legacy:'https://sites.google.com/view/mechanicslab/PSI',
  instagram:'https://www.instagram.com/postech_psi/', avionics:'https://github.com/postech-psi/Avionics/tree/7cfb5be044e539c2e3c6d79a6538416a2741cd67',
  flightSoftware:'https://github.com/postech-psi/Avionics/blob/7cfb5be044e539c2e3c6d79a6538416a2741cd67/flight-computer/README.md',
  groundStation:'https://github.com/postech-psi/Avionics/blob/7cfb5be044e539c2e3c6d79a6538416a2741cd67/ground-station/README.md',
  tms:'https://github.com/postech-psi/TMS/tree/abb02a09bca4e7835425dc67b2c28234ef887992', motor:'https://github.com/postech-psi/SRM-Solid-Rocket-Motor',
  tests:'https://github.com/postech-psi/test-results', testPortal:'https://postech-psi.github.io/test-results/', learning:'https://github.com/postech-psi/psintelligence',
  tvc:'https://github.com/postech-psi/tvc-testbed', tvcData:'https://github.com/postech-psi/tvc-data',
  article:'https://www.postech.ac.kr/kor/newscenter/university-blog.do?articleNo=47318&mode=view',
  flight1:'https://www.youtube.com/watch?v=shCFnkVdeV8', flight2:'https://www.youtube.com/watch?v=j5gvQXlkA6I'
};
export const nav = [
  ['projects','Projects','프로젝트'],['research','Research','연구'],['records','Records','기록'],
  ['gallery','Gallery','갤러리'],['about','About','소개'],['support','Support & Contact','후원·문의']
];
export const pageTitles = {
  aircraft:text('Aircraft','항공기'),records:text('Records','기록'),
  gallery:text('Gallery','갤러리'),
  avionics:text('Avionics','비행 전자장치'),tms:text('Thrust Measurement System','추력 측정 시스템'),
  index:text('PSI — Student aerospace at POSTECH','PSI — 포스텍 항공우주연구회'),
  projects:text('Projects','프로젝트'),pslv:text('PSLV rocket programme','PSLV 로켓 프로젝트'),
  research:text('Research','연구'),learning:text('Learning at PSI','PSI에서 배우기'),
  about:text('About PSI','PSI 소개'),news:text('News','소식'),join:text('Join PSI','PSI와 함께하기'),
  support:text('Support & Contact','후원·문의')
};
const drive = id => `https://drive.google.com/file/d/${id}/view`;
export const research = [
 {id:'kspe-2025-coursework',title:'교과목-동아리 연계 소형 고체 연료 로켓 개발',english:'Developing a small solid-fuel rocket through coursework and student-club collaboration',venue:'KSPE',form:text('Oral presentation','구두 발표'),type:'conference',topic:'education',year:2025,url:drive('1ki-VGFk6xi9qnl6Z_j20O88ntvtjVrhM')},
 {id:'kspe-2025-plif',title:'PLIF 기반 압력 강하 비율에 따른 스월 인젝터의 혼합 성능 비교 분석',english:'Comparing swirl-injector mixing at different pressure-drop ratios using PLIF',venue:'KSPE',form:text('Oral presentation','구두 발표'),type:'conference',topic:'propulsion',year:2025,url:drive('1iYOdIXTxLU06i1ClpaMIEWEwZANjFZVx')},
 {id:'kspe-2025-mesostructure',title:'소형 비행체에서 Meso-structure의 적용과 비행 안정성 간의 상관관계 분석',english:'The relationship between mesostructures and flight stability in small aircraft',venue:'KSPE',form:text('Oral presentation','구두 발표'),type:'conference',topic:'aircraft',year:2025,url:drive('18Zpn5tlT5AZgWjy0wT2B9YQdw2moVFo1')},
 {id:'ksas-2025-separation',title:'자세 안정성 판단 기반 분리-점화 알고리즘을 적용한 사운딩 로켓 단 분리 시스템의 성능 분석',english:'Assessing a sounding-rocket stage-separation system using an attitude-stability decision algorithm',venue:'KSAS',form:text('Conference poster','학회 포스터'),type:'conference',topic:'control',year:2025,url:drive('1vgQpNfTPpf9Z9knnaDKAlGz0HRge-KZA')},
 {id:'ksas-2025-fusion',title:'Kalman filter 기반 초소형 사운딩 고체 로켓 에비오닉스 센서 퓨전 시스템 설계 및 적용',english:'Design and application of Kalman-filter sensor fusion for small sounding-rocket avionics',venue:'KSAS',form:text('Conference poster','학회 포스터'),type:'conference',topic:'avionics',year:2025,url:drive('15Oy5_9w7oGukbOwcZR5xXg9PGktP3rJS')},
 {id:'ksas-2025-vortex',title:'소형 비행체의 고속 비행에서 Vortex Generator 적용에 따른 비행 안정성 분석',english:'How vortex generators affect the stability of small aircraft in high-speed flight',venue:'KSAS',form:text('Conference poster','학회 포스터'),type:'conference',topic:'aircraft',year:2025,url:drive('15fRVmHy-4uWsBUU9cVRTZA7Pkvluw9Sd')},
 {id:'ksas-2025-injector',title:'1kN 액체 사운딩 로켓용 스월 인젝터의 압력 강하 비율에 따른 혼합 성능 분석',english:'Swirl-injector mixing at different pressure-drop ratios for a 1 kN liquid sounding-rocket concept',venue:'KSAS',form:text('Conference poster','학회 포스터'),type:'conference',topic:'propulsion',year:2025,url:drive('1YZKK8CAeH42VHFr13A6bXzg-FHG1d8dj')},
 {id:'ksme-2025-cfd',title:'CFD 기반 유체 흐름 시각화를 통한 항공우주 교육 효과 향상 연구',english:'Using CFD flow visualisation to improve aerospace education',venue:'KSME',form:text('Education proceedings, pp. 43–45','공학교육 학술대회 논문집 43–45쪽'),type:'conference',topic:'education',year:2025,url:drive('1fD1RQUjkdRyEZC-FYBs83aTPlVPI06HC')},
 {id:'ksme-2025-model',title:'로켓공학 교과목-항공우주동아리 연계 교육 모델',english:'An education model connecting rocket-engineering coursework with an aerospace club',venue:'KSME',form:text('Education proceedings, pp. 31–34','공학교육 학술대회 논문집 31–34쪽'),type:'conference',topic:'education',year:2025,url:drive('19PaEMkf-DlhRNe_EU4-GL571Tq3Lb2HV')},
 {id:'ugrp-2025-avionics',title:'적층형 센서 퓨전 에비오닉스',english:'Stacked sensor-fusion avionics',venue:'UGRP',form:text('Highest excellence award (최우수상) — 6 February 2026','최우수상 — 2026년 2월 6일 수상'),type:'award',topic:'avionics',year:2025,url:sources.legacy},
 {id:'ugrp-2025-injector',title:'스월 인젝터 혼합 성능',english:'Swirl-injector mixing performance',venue:'UGRP',form:text('Excellence award (우수상) — 6 February 2026','우수상 — 2026년 2월 6일 수상'),type:'award',topic:'propulsion',year:2025,url:sources.legacy},
 {id:'ugrp-2025-control',title:'다단 로켓 제어',english:'Staged-rocket control',venue:'UGRP',form:text('Encouragement award (장려상) — 6 February 2026','장려상 — 2026년 2월 6일 수상'),type:'award',topic:'control',year:2025,url:sources.legacy},
 {id:'ugrp-2024-carbon',title:'탄소섬유 로켓 동체',english:'Carbon-fibre rocket bodies',venue:'UGRP',form:text('Encouragement award (장려상) — 13 February 2025','장려상 — 2025년 2월 13일 수상'),type:'award',topic:'structures',year:2024,url:sources.legacy},
 {id:'ugrp-2024-nozzle',title:'CFD 기반 노즐 최적화',english:'CFD-based nozzle optimisation',venue:'UGRP',form:text('Encouragement award (장려상) — 13 February 2025','장려상 — 2025년 2월 13일 수상'),type:'award',topic:'propulsion',year:2024,url:sources.legacy},
 {id:'ugrp-2024-satellite',title:'인공위성 수명 서비스',english:'Satellite lifetime services',venue:'UGRP',form:text('Encouragement award (장려상) — 13 February 2025','장려상 — 2025년 2월 13일 수상'),type:'award',topic:'space',year:2024,url:sources.legacy}
];
export const topicLabels={avionics:text('Flight electronics','비행 전자장치'),propulsion:text('Propulsion & mixing','추진과 혼합'),aircraft:text('Aircraft stability','항공기 안정성'),control:text('Flight control','비행 제어'),education:text('Aerospace education','항공우주 교육'),structures:text('Structures','구조'),space:text('Space systems','우주 시스템')};
export const flights=[
 {date:'2024-11-15',vehicle:'PSLV-I',title:text('The first launch','첫 번째 발사'),body:text('PSI’s first-generation solid-propellant sounding rocket launched at KARI’s Goheung site. This flight established the programme’s first public launch milestone.','한국항공우주연구원 고흥 항공센터에서 1세대 고체 추진 사운딩 로켓을 발사했습니다. PSI 로켓 프로젝트의 첫 공개 발사 기록입니다.'),url:sources.flight1},
 {date:'2025-08-09',vehicle:'PSLV-I',title:text('A new avionics flight','발사와 에비오닉스 시험'),body:text('Launch successful, recovery failed.','발사 성공, 회수 실패.'),url:null},
 {date:'2025-12-05',vehicle:'PSLV-II',title:text('A recovery mission completed','회수 임무를 마치다'),body:text('The public PSI timeline records PSLV-II’s launch at KARI Goheung, with the parachute and 360-degree video missions completed.','PSI 공개 연혁에 따르면 한국항공우주연구원 고흥 항공센터에서 PSLV-II를 발사해 낙하산과 360도 영상 촬영 임무를 완료했습니다.'),url:sources.flight2}
];
export const tests=resultCatalog.tests.map(item=>({id:item.id,date:item.date,url:`${sources.testPortal}${item.links.page}`,sourceUrl:`${sources.tests}/blob/11df0dc525da7113dd504e363662f59498e2a587/tests/${item.date}/index.md`}));
export const news=[
 {date:'2026-02-06',kind:text('Research awards','연구 수상'),title:text('Three teams recognised for 2025 UGRP research','2025년 UGRP 연구, 세 팀 수상'),body:text('Avionics sensor fusion, swirl-injector mixing and staged-rocket control were recognised. The research year is 2025; the award ceremony took place in 2026.','센서 퓨전 에비오닉스, 스월 인젝터 혼합, 다단 로켓 제어 연구가 수상했습니다. 연구 연도는 2025년이며 수상 행사는 2026년에 열렸습니다.'),url:sources.github},
 {date:'2025-12-05',kind:text('Flight','비행'),title:text('PSLV-II launch and recovery mission','PSLV-II 발사 및 회수 임무'),body:text('The public timeline records a launch at KARI Goheung and completion of parachute and 360-degree video missions.','공개 연혁에 고흥에서의 발사와 낙하산·360도 영상 촬영 임무 완료가 기록되어 있습니다.'),url:sources.flight2},
 {date:'2025-12-03',kind:text('Conference','학회'),title:text('Three oral presentations at KSPE','한국추진공학회 구두 발표 3건'),body:text('PSI presented work on coursework-linked rocket development, injector mixing and mesostructures in small aircraft at the fall conference.','추계학술대회에서 교과목 연계 로켓 개발, 인젝터 혼합, 소형 비행체의 메조구조 연구를 발표했습니다.'),url:sources.legacy},
 {date:'2025-12-02',kind:text('Recognition','수상'),title:text('Undergraduate POSTECHIAN Award','학부 POSTECHIAN상 수상'),body:text('A university recognition recorded in PSI’s public history, followed by a commemorative team photograph.','PSI 공개 연혁에 기록된 대학 수상 소식입니다. 수상 기념 단체 사진도 남겼습니다.'),url:sources.article},
 {date:'2025-11-14',kind:text('Conference','학회'),title:text('Four posters at the KSAS fall conference','한국항공우주학회 추계학술대회 포스터 4건'),body:text('Research covered stage separation, sensor fusion, aircraft stability and swirl-injector mixing.','단 분리, 센서 퓨전, 항공기 안정성, 스월 인젝터 혼합 연구를 발표했습니다.'),url:sources.legacy},
 {date:'2025-08-09',kind:text('Flight','비행'),title:text('PSLV-I at the NURA launch competition','NURA 발사대회의 PSLV-I'),body:text('Launch successful, recovery failed.','발사 성공, 회수 실패.'),url:null},
 {date:'2025-07-20',kind:text('Conference & award','학회와 수상'),title:text('PSLV-I presentation receives KARI President’s Award','PSLV-I 발표, 한국항공우주연구원장상 수상'),body:text('PSI presented its rocket programme at the NURA academic conference.','NURA 학술대회에서 PSI의 로켓 프로젝트를 발표했습니다.'),url:sources.github},
 {date:'2025-02-13',kind:text('Research awards','연구 수상'),title:text('Three 2024 UGRP projects recognised','2024년 UGRP 연구 세 팀 수상'),body:text('Carbon-fibre bodies, CFD nozzle optimisation and satellite lifetime services each received an encouragement award (장려상).','탄소섬유 동체, CFD 노즐 최적화, 인공위성 수명 서비스 연구가 각각 장려상을 받았습니다.'),url:sources.legacy},
 {date:'2024-11-15',kind:text('First flight','첫 비행'),title:text('PSLV-I launches at Goheung','고흥에서 PSLV-I 첫 발사'),body:text('The first public launch milestone for PSI’s solid-propellant sounding-rocket programme.','PSI 고체 추진 사운딩 로켓 프로젝트의 첫 공개 발사 기록입니다.'),url:sources.flight1},
 {date:'2024-02-20',kind:text('Founding','창립'),title:text('PSI is founded','PSI 창립'),body:text('The founding date recorded by the POSTECH PSI organisation. Preparations had begun in 2023.','POSTECH PSI 공개 조직 정보에 기록된 창립일입니다. 학생들의 준비는 2023년부터 시작되었습니다.'),url:sources.github}
];
export const curriculum=[
 {title:text('Start with probability and measurements','확률과 측정부터'),body:text('Use the introductory notebooks to connect uncertainty, noisy measurements and Kalman filtering. A sensor reading becomes more useful when you can explain what it does and does not tell you.','입문 노트북으로 불확실성, 잡음이 있는 측정값, 칼만 필터를 연결해 봅니다. 센서가 알려 주는 것과 알려 주지 못하는 것을 이해하는 데서 출발합니다.')},
 {title:text('Estimate a changing flight state','변하는 비행 상태 추정하기'),body:text('Explore Kalman filters, the extended Kalman filter and the unscented Kalman filter. Compare how models and measurements contribute to an estimate.','칼만 필터, 확장 칼만 필터(EKF), 무향 칼만 필터(UKF)를 탐구하며 모델과 측정값이 추정에 어떻게 기여하는지 비교합니다.')},
 {title:text('Study rocket-apogee prediction','로켓 최고 고도 예측 연구'),body:text('PSIntelligence introduces physics-informed models and sequence models for apogee prediction, alongside uncertainty estimation. These are learning resources and research directions.','PSIntelligence는 최고 고도 예측을 위한 물리 기반 학습 모델과 시퀀스 모델, 불확실성 추정을 다룹니다. 학습 자료이자 연구 방향으로 살펴볼 수 있습니다.')},
 {title:text('Think about onboard deployment','탑재 환경까지 생각하기'),body:text('Consider the practical step from a notebook to onboard computation: timing, limited resources and the meaning of a reliable estimate. The curriculum does not claim that every model has flown.','노트북의 코드를 비행체에 탑재할 때 필요한 계산 시간, 제한된 자원, 추정값의 신뢰성을 생각합니다. 교육 과정의 모든 모델이 실제 비행에 사용되었다는 뜻은 아닙니다.')}
];

// Current roles supplied by PSI in this design review; English names are editorial romanizations.
export const leadership=[
 {role:'President',name:'Uikang Joo'},
 {role:'Vice President',name:'Yeonho Kim'},
 {role:'Secretary',name:'Taeho Lee'},
 {role:'Avionics & TMS Lead',name:'Jaeyoung Park'},
 {role:'Faculty advisor',name:'Jin-Tae Kim'}
];
