import http from "k6/http";
import {check} from "k6";

const BASE_URL = "https://sk0ldkamg3.execute-api.ap-northeast-2.amazonaws.com/index-token-db";

export const options = {
  scenarios: {
    scalability_test: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        {duration: "5m", target: 100}, // 5분 동안 100명까지 증가
        {duration: "5m", target: 200}, // 5분 동안 200명까지 증가
        {duration: "5m", target: 300}, // 5분 동안 300명까지 증가
        {duration: "5m", target: 0}, // 5분 동안 0명으로 감소
      ],
      gracefulStop: "5s",
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<2000"],
    http_req_failed: ["rate<0.05"],
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
