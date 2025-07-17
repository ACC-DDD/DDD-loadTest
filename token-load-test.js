import http from "k6/http";
import {check} from "k6";

const BASE_URL = "https://sk0ldkamg3.execute-api.ap-northeast-2.amazonaws.com/disaster-token-db"; // ← 실제 API Gateway 주소로 교체

export const options = {
  scenarios: {
    spike_test: {
      executor: "ramping-arrival-rate",
      startRate: 5, // 시작 TPS
      timeUnit: "1s", // 보통 1초 기준으로 요청 생성
      preAllocatedVUs: 100, // 최소 가상 사용자 수 -> 부하테스트에 직접적인 영향은 X
      maxVUs: 500, // 최대 확장 가능 사용자 수 -> 부하테스트에 직접적인 영향은 X
      stages: [
        {target: 50, duration: "1m"},   // target: timeUnit 당 목표하는 요청 수
        {target: 100, duration: "1m"},  // duration: target 도달까지 걸리는 시간
        {target: 150, duration: "1m"},  // 여러 개 작성 시 연속해서 테스트 가능
        {target: 200, duration: "2m"},
        {target: 0, duration: "10s"},
      ],
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<4000", "p(99)<5000"], // 95% 응답 < 4초, 99% 응답 < 5초
    http_req_failed: ["rate<0.05"], // 에러율 5% 이하
  },
};

export default function () {
  const url = `${BASE_URL}`;
  const token = `dmmNgOc_v8hxQ7suxK7w48:APA91bGboD-zpHdrFYzhsPX6DbKz73HdbnWCoS9CyqlacAKBE46QmrNl3lV2aHyEqigaOtXGSheypHFeoo9JrZ3OMEAhJViqttbkVF8q5wu_-VqQeHDEo8Y`;
  const payload = JSON.stringify({
    token: token,
    topic: "all",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "응답 200 또는 202": (r) => r.status === 200 || r.status === 202,
    "응답 시간 < 5초": (r) => r.timings.duration < 5000,
  });
}
