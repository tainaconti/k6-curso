import http from 'k6/http';
import {check} from 'k6';
import { Counter } from 'k6/metrics';
import { Gauge } from 'k6/metrics';
import { Rate } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
    vus: 1,
    durantion: '3s',
    thresholds: {
        http_req_failed: ['rate < 0.01'],
        http_req_duration: [{threshold:'p(95) < 200', abortOnFail: true, delayAbortEval: '10s'}]
    }
}

// const chamadas = new Counter('quantidade de chamadas')
// const myGauge = new Gauge('tempo bloqueado')
// const myRate = new Rate('taxa de req 200')
// const myTrend = new Trend('taxa de espera')

export default function () {
    const res = http.get('http://test.k6.io')
    //contador
    // chamadas.add(1);
    // //medidor
    // myGauge.add(req.timings.blocked);
    // //taxa
    // myRate.add(req.status === 200);
    // //tendência
    // myTrend.add(req.timings.waiting);

    check(res, {
    'status code é 200': (r) => r.status === 200
    }
    );

}
export function handleSummary(data) {
    return {
    "teste_k6.html": htmlReport(data),
    };

}