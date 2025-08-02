import http from "k6/http";
import {check} from "k6";

const BASE_URL = "https://sk0ldkamg3.execute-api.ap-northeast-2.amazonaws.com/index-token-db";

export const options = {
  scenarios: {
    stress_test: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        {duration: "1m", target: 100}, // 1분 동안 100명까지 증가
        {duration: "3m", target: 1000}, // 3분 동안 1000명까지 급격히 증가 (스트레스 구간)
        {duration: "1m", target: 0}, // 1분 동안 0명으로 감소
      ],
      gracefulStop: "5s",
    },
  },
  thresholds: {
    // 스트레스 테스트는 임계값을 초과하는 것을 목적으로 하기에 느슨하게 설정하거나 아예 설정하지 않을 수 있음
    http_req_duration: ["p(99)<20000"], // 응답 시간이 20초 이내여야 함
  },
};

export default function () {
  const payload = JSON.stringify({
    token: `dmmNgOc_v8hxQ7suxK7w48:APA91bGboD-zpHdrFYzhsPX6DbKz73HdbnWCoS9CyqlacAKBE46QmrNl3lV2aHyEqigaOtXGSheypFHeoo9JrZ3OMEAhJViqttbkVF8q5wu_-VqQeHDEo8Y`,
    topic: "all",
  });
  const params = {
    headers: {"Content-Type": "application/json"},
  };

  const res = http.post(BASE_URL, payload, params);
  check(res, {"status is 200 or 202": (r) => r.status === 200 || r.status === 202});
}
