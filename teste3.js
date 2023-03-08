// //Public API: Exemplo 2
//  - Buscar crocodilo por Id
// Critérios:
// -Performance teste1 
//     - Ramp up 10 VU em 10s
//     - Carga 10 VU por 10s
//     - Ramp down 0 VU em 10s
// -Limites: 
//     -Requisição com sucesso > 95%
//     - Tempo requisição package(90) < 200
import http from 'k6/http';
import {sleep, check} from 'k6';
import { SharedArray } from 'k6/data';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
    stages: [
        { duration: '10s', target: 10 }, 
        { duration: '10s', target: 10 },
        { duration: '10s', target: 0 } 
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(95) < 200']
    }
}

const data = new SharedArray('ler dados', function () {
    return JSON.parse(open('./dados.json')).users;
});

export default function(){

    const userId = data[Math.floor(Math.random() * data.length)].id;
    console.log(userId)
    const BASE_URL = `https://test-api.k6.io/public/crocodiles/${userId}`;
    const res = http.get(BASE_URL)
    
    check(res,{
        'status 200': (r) => r.status === 200
    });
    sleep(1);
}

export function handleSummary(data) {
    return {
    "teste_k6.html": htmlReport(data),
    };

}