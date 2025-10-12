import http from "k6/http";
import {check} from "k6";

// 실제 DB 읽는 API 엔드포인트로 변경
const BASE_URL = "https://your-db-read-endpoint/api/data";

// 테스트 유형에 따라 시나리오를 선택하여 실행
// 예: 'load_test', 'endurance_test', 'scalability_test', 'spike_test', 'stress_test'
const TEST_SCENARIO = "load_test";

export const options = {
  scenarios: {
    // 1. Load Test (부하 테스트)
    load_test: {
      executor: "constant-vus",
      vus: 50,
      duration: "5m",
      exec: "runTest",
    },

    // 2. Endurance / Soak Test (내구성/안정성 테스트)
    endurance_test: {
      executor: "constant-vus",
      vus: 100,
      duration: "4h",
      exec: "runTest",
    },

    // 3. Scalability Test (확장성 테스트)
    scalability_test: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        {duration: "10m", target: 300},
        {duration: "5m", target: 300},
      ],
      exec: "runTest",
    },

    // 4. Spike Test (스파이크 테스트)
    spike_test: {
      executor: "ramping-arrival-rate",
      startRate: 5,
      preAllocatedVUs: 200,
      stages: [
        {duration: "2m", target: 200},
        {duration: "1m", target: 200},
        {duration: "1m", target: 5},
      ],
      exec: "runTest",
    },

    // 5. Stress Test (스트레스 테스트)
    stress_test: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        {duration: "20m", target: 1000},
      ],
      exec: "runTest",
    },
  },

  // 테스트 시나리오에 따른 동적 임계값 설정
  thresholds: {
    "http_req_duration{scenario:load_test}": ["p(95)<1000"],
    "http_req_failed{scenario:load_test}": ["rate<0.01"],

    "http_req_duration{scenario:endurance_test}": ["p(95)<1000"],
    "http_req_failed{scenario:endurance_test}": ["rate<0.01"],

    "http_req_duration{scenario:scalability_test}": ["p(95)<2000"],
    "http_req_failed{scenario:scalability_test}": ["rate<0.05"],

    "http_req_duration{scenario:spike_test}": ["p(95)<4000", "p(99)<5000"],
    "http_req_failed{scenario:spike_test}": ["rate<0.05"],

    "http_req_duration{scenario:stress_test}": ["p(99)<20000"],
  },
};

export function runTest() {
  const params = {
    headers: {"Content-Type": "application/json"},
  };

  const res = http.get(BASE_URL, params);

  check(res, {
    "status is 200": (r) => r.status === 200,
  });
}
