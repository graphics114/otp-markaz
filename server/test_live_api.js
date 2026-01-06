import axios from 'axios';

async function test() {
    try {
        const response = await fetch('https://otp-markaz-api.onrender.com/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'test-student',
                password: 'student123'
            })
        });
        const data = await response.json();
        console.log("LOGIN TEST AGAINST RENDER:");
        console.log("Status:", response.status);
        console.log("Data:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("TEST FAILED:", err.message);
    }
}
test();
