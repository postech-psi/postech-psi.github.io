// Reader-facing summaries of the September 2026 working manuscripts.
// Private documents and operating parameters are intentionally not distributed.
const text = (en,ko) => ({en,ko});
export const currentResearch = [
  {
    id:'stage-separation', team:1,
    title:text('Definition of Ignition Safety Envelope Based on Transient Dynamics of Stage Separation Rockets and Development of Autonomous Ignition System','단 분리 로켓의 과도 동역학 기반 점화 안전 한계선 정의 및 자율 점화 시스템 개발'),
    shortTitle:text('Motion after stage separation','단 분리 이후의 운동'),
    question:text('The team studies post-separation attitude changes to inform autonomous ignition decisions.','분리 직후의 자세 변화를 연구해 자율 점화 판단에 활용합니다.'),
    method:text('A mechanical separation prototype and ground tests inform the uncertain initial conditions of a reduced-order, six-degree-of-freedom model. Quaternion attitude representation and Barrowman aerodynamics describe the motion; Monte Carlo simulations explore how differences at separation affect the subsequent trajectory. Preliminary simulation identifies tilt as a candidate indicator for distinguishing conditions.','기계식 분리 시제품과 지상 시험으로 분리 직후 초기 조건의 불확실성을 파악하고, 이를 축약된 6자유도 모델에 반영합니다. 쿼터니언 자세 표현과 Barrowman 공력 모델로 운동을 기술하며, 몬테카를로 시뮬레이션으로 분리 조건에 따른 궤적 차이를 살펴봅니다. 예비 시뮬레이션에서는 기울기각을 조건 구분에 활용할 가능성을 확인했습니다.'),
    stage:text('Prototype and preliminary simulation; ground initial-condition tests are ongoing. Autonomous multistage flight and an operational safety envelope have not been validated.','시제품과 예비 시뮬레이션 단계이며 초기 조건을 확인하는 지상 시험을 진행 중입니다. 자율 다단 비행이나 운용 가능한 안전 한계선의 검증을 완료한 것은 아닙니다.'),
    next:text('Refine the model with ground-test observations, assess the decision boundary across uncertain conditions, and develop the onboard decision logic. These remain research and validation tasks.','지상 시험 관측으로 모델을 보완하고 불확실한 조건에서 판단 경계를 검토하며, 탑재 판단 로직을 개발할 계획입니다. 모두 앞으로의 연구와 검증 과제입니다.')
  },
  {
    id:'precision-landing', team:2,
    title:text('Robust Precision Landing of an Unmanned Aerial Vehicle Using PPO-Based Residual Control','PPO 기반 잔차 제어를 이용한 무인항공기의 강건한 정밀 착륙 기법'),
    shortTitle:text('Learning-assisted precision landing','강화학습 기반 정밀 착륙'),
    question:text('A conventional landing controller with bounded learned corrections for wind, sensing delays and target uncertainty.','기존 착륙 제어기에 제한된 학습 보정을 더해 바람·센서 지연·목표 불확실성에 대응합니다.'),
    method:text('A PD velocity controller is paired with a Proximal Policy Optimization (PPO) policy that supplies residual velocity corrections. Matched Monte Carlo simulations compare baseline and residual control under nominal, delay, target, wind and mixed conditions, including sensor noise and dropout. The paired evaluation helps distinguish a controller change from differences in the simulated scenarios.','PD 속도 제어기에 PPO(Proximal Policy Optimization) 정책의 잔차 속도 보정을 결합합니다. 동일한 조건의 몬테카를로 시뮬레이션으로 기본 제어기와 잔차 제어기를 비교하며, 정상·지연·목표·바람·복합 조건에서 센서 잡음과 데이터 손실 등을 반영합니다. 짝지은 평가로 제어기 변화의 영향과 시험 조건 차이를 구분합니다.'),
    stage:text('Simulation feasibility study. Some disturbed conditions show a small improvement trend, but statistical significance is not established. Physical landing performance is not yet validated.','시뮬레이션 기반 가능성 검토 단계입니다. 일부 교란 조건에서 소폭의 개선 경향이 있지만 통계적 유의성은 확인되지 않았으며, 실제 비행 착륙 성능은 아직 검증하지 않았습니다.'),
    next:text('Increase the number of evaluation episodes and test how the combined controller transfers to PX4-based real-flight experiments. Simulation results are a starting point, not a completed flight demonstration.','평가 에피소드를 늘리고 PX4 기반 실제 비행 실험으로 결합 제어기의 적용 가능성을 검증할 계획입니다. 현재 시뮬레이션 결과는 비행 실증을 위한 출발점입니다.')
  },
  {
    id:'electric-tvc', team:3,
    title:text('Development and Control of an Electric TVC VTVL Testbed for RLV Technology','재사용 발사체 기술 개발을 위한 전기식 TVC 수직이착륙 시연체의 개발 및 제어'),
    shortTitle:text('An electric thrust-vectoring testbed','전기식 추력 편향 시연체'),
    question:text('An electric testbed for studying thrust-vector control, attitude and altitude response.','추력 편향 제어와 자세·고도 응답을 연구하는 전기식 실험 플랫폼입니다.'),
    method:text('The built testbed combines coaxial counter-rotating propellers with a two-axis gimbal. A Pixhawk 6C running PX4 communicates with a Raspberry Pi 5 through uXRCE-DDS. Measured propulsion, actuator and mass characteristics feed a nonlinear six-degree-of-freedom simulator, where cascaded PID controllers are studied for attitude and altitude response.','제작한 시연체는 동축반전 프로펠러와 2축 짐벌을 결합합니다. PX4를 사용하는 Pixhawk 6C와 Raspberry Pi 5가 uXRCE-DDS로 통신합니다. 측정한 추진·구동기·질량 특성을 비선형 6자유도 시뮬레이터에 반영하고, 캐스케이드 PID 제어기로 자세와 고도 응답을 연구합니다.'),
    stage:text('Hardware built and experimentally characterised; control response studied in simulation. Free-flight vertical takeoff and landing have not yet been demonstrated.','하드웨어 제작과 실험적 특성 측정을 수행하고 시뮬레이션에서 제어 응답을 살펴본 단계입니다. 자유 비행 수직이착륙 실증은 아직 진행하지 않았습니다.'),
    next:text('Validate takeoff, hover and descent in free flight. Model-predictive control and convex-optimisation guidance are later research directions, not capabilities established by the current results.','자유 비행에서 이륙·호버링·하강을 검증할 계획입니다. 모델 예측 제어와 볼록 최적화 유도는 이후 연구 방향이며 현재 결과로 실증한 기능은 아닙니다.')
  },
  {
    id:'hybrid-injector', team:4,
    title:text('Annular Swirl Injector Design Model for a 120 N End-burning Hybrid Rocket','120 N급 End-burning 하이브리드 로켓용 환형 스월 인젝터의 설계 모델'),
    shortTitle:text('Uniform flow through an annular injector','환형 인젝터의 균일한 유동'),
    question:text('An annular swirl injector model for even oxidiser distribution across end-burning hybrid fuel.','단면 연소형 하이브리드 연료에 산화제를 고르게 전달하는 환형 스월 인젝터를 모델링합니다.'),
    method:text('A coupled model connects injector geometry and hydraulics with fuel regression and motor performance to narrow the feasible designs. Steady, single-phase RANS simulations with an SST turbulence model then examine the flow, using area-weighted mass-flux uniformity to compare candidate designs.','인젝터 형상·수력학·연료 후퇴율·모터 성능을 결합한 모델로 가능한 설계 범위를 좁힙니다. 이후 SST 난류 모델을 사용한 정상 단상 RANS 시뮬레이션으로 유동을 살펴보고, 면적 가중 질량 유속 균일도로 설계 후보를 비교합니다.'),
    stage:text('Design model and CFD study; experimental validation is pending. “120 N” names the reference design class, not measured thrust from this study.','설계 모델과 CFD 연구 단계이며 실험 검증은 앞으로의 과제입니다. 제목의 “120 N급”은 기준 설계 등급으로, 이 연구에서 측정한 추력이 아닙니다.'),
    next:text('Compare the model with PLIF cold-flow measurements and subsequent hot-fire validation. Simulated flow uniformity must still be tested against physical measurements.','PLIF 냉간 유동 측정과 후속 연소 시험으로 모델을 검증할 계획입니다. 시뮬레이션의 유동 균일도를 실제 측정과 비교하는 과정이 남아 있습니다.')
  },
  {
    id:'tail-fin-control', team:5,
    title:text('Development of a Tail-Fin Control System for a Subsonic Sounding Rocket Using Gain-Scheduled PID Control','게인 스케줄링 PID 제어를 이용한 아음속 사운딩 로켓의 테일핀 제어 시스템 개발'),
    shortTitle:text('Tail-fin attitude control','테일핀 자세 제어'),
    question:text('Gain-scheduled PID control of four independent tail fins under changing flight conditions.','변하는 비행 조건에 맞춰 네 개의 독립 테일핀을 게인 스케줄링 PID로 제어합니다.'),
    method:text('A mechanical actuation prototype is paired with a MATLAB/Simulink six-degree-of-freedom digital twin. CAD and OpenRocket inform inertia and stability, while actuator limits and delays are represented in the model. Prototype checks examine fit and mechanical play; the simulation architecture defines how the controller will be evaluated.','기계식 구동 시제품과 MATLAB/Simulink 6자유도 디지털 트윈을 함께 개발합니다. CAD와 OpenRocket으로 관성과 안정성을 파악하고, 모델에 구동기 한계와 지연을 반영합니다. 시제품의 조립 적합성과 유격을 점검하며 시뮬레이션 구조와 제어기 평가 절차를 구성합니다.'),
    stage:text('Actuation prototype and basic digital-twin architecture. Hardware-in-the-loop and flight validation are not complete; no quantified control-performance gain is established.','구동 시제품과 기본 디지털 트윈 구조를 구성한 단계입니다. HIL 및 비행 검증은 완료하지 않았으며 정량적인 제어 성능 향상을 입증한 상태는 아닙니다.'),
    next:text('Refine aerodynamic coefficients through CFD, identify actuator response, complete the gain schedule and run disturbance simulations. Ground integration and a later flight test form the planned validation path.','CFD 공력 계수 보완, 구동기 응답 식별, 게인 스케줄 완성, 교란 시뮬레이션을 진행할 계획입니다. 이후 지상 통합과 비행 시험으로 검증을 이어 갑니다.')
  }
];
