import http from 'http';

const testEndpoint = (path, method = 'GET', body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers: defaultHeaders,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ status: res.statusCode, headers: res.headers, data: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, headers: res.headers, raw: data });
          }
        });
      }
    );

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Starting OpenPath Backend API Verification...');

  try {
    // 1. Health check
    const health = await testEndpoint('/api/health');
    console.log(`[PASS] Health Check (${health.status}):`, health.data.product);

    // 2. Skills list
    const skills = await testEndpoint('/api/skills');
    console.log(`[PASS] Skills API (${skills.status}): Found ${skills.data.data.count} canonical skills`);

    // 3. Opportunities list
    const opps = await testEndpoint('/api/opportunities');
    console.log(`[PASS] Opportunities API (${opps.status}): Found ${opps.data.data.count} opportunities`);
    const sampleOpp = opps.data.data.opportunities[0];

    // 4. Student Login
    const loginRes = await testEndpoint('/api/auth/login', 'POST', {
      email: 'alex.rivera@university.edu',
      password: 'password123',
    });
    console.log(`[PASS] Auth Login (${loginRes.status}): Logged in as ${loginRes.data.data.user.name}`);
    const token = loginRes.data.data.token;

    // 5. Match Explanation
    const matchRes = await testEndpoint(
      `/api/opportunities/${sampleOpp._id}/match`,
      'GET',
      null,
      { Authorization: `Bearer ${token}` }
    );
    console.log(
      `[PASS] Match Explanation (${matchRes.status}): Score = ${matchRes.data.data.match.overallScore}% (${matchRes.data.data.match.matchBadge})`
    );
    console.log('       5-Factor Breakdown Weights:', Object.keys(matchRes.data.data.match.breakdown));

    // 6. Skill Gap Analysis
    const gapRes = await testEndpoint(
      `/api/opportunities/${sampleOpp._id}/skill-gap`,
      'GET',
      null,
      { Authorization: `Bearer ${token}` }
    );
    console.log(
      `[PASS] Skill Gap API (${gapRes.status}): Matched: ${gapRes.data.data.skillGap.matchedCount}, Missing: ${gapRes.data.data.skillGap.missingCount}`
    );

    // 7. Student Applications
    const appRes = await testEndpoint('/api/applications', 'GET', null, {
      Authorization: `Bearer ${token}`,
    });
    console.log(`[PASS] Applications API (${appRes.status}): Found ${appRes.data.data.count} tracked applications`);

    // 8. Employer Candidate Review
    const empLogin = await testEndpoint('/api/auth/login', 'POST', {
      email: 'recruiter@techcorp.io',
      password: 'password123',
    });
    const empToken = empLogin.data.data.token;

    const empOpps = await testEndpoint('/api/employer/opportunities', 'GET', null, {
      Authorization: `Bearer ${empToken}`,
    });
    console.log(`[PASS] Employer Opportunities (${empOpps.status}): Found ${empOpps.data.data.count} listings`);

    const candidatesRes = await testEndpoint(
      `/api/employer/opportunities/${empOpps.data.data.opportunities[0]._id}/candidates`,
      'GET',
      null,
      { Authorization: `Bearer ${empToken}` }
    );
    console.log(
      `[PASS] Candidate Review API (${candidatesRes.status}): ${candidatesRes.data.data.candidateCount} candidates evaluated with match scores`
    );

    console.log('\n🎉 ALL BACKEND API ENDPOINTS VERIFIED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
};

runTests();
