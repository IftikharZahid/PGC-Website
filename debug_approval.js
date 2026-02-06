import fetch from 'node-fetch';

async function testApproval() {
    try {
        // 1. Get all admissions
        console.log('Fetching admissions...');
        const res = await fetch('http://localhost:5000/api/admissions');
        const data = await res.json();

        if (!data.success || data.data.length === 0) {
            console.log('No admissions found to test.');
            return;
        }

        const admission = data.data.find(a => a.status === 'pending');
        if (!admission) {
            console.log('No pending admissions found.');
            return;
        }

        console.log(`Attempting to approve admission: ${admission._id} (${admission.fullName})`);

        // 2. Try to approve
        const updateRes = await fetch(`http://localhost:5000/api/admissions/${admission._id || admission.applicationId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Approved' })
        });

        const updateData = await updateRes.json();
        console.log('Update Response:', JSON.stringify(updateData, null, 2));

    } catch (err) {
        console.error('Test failed:', err);
    }
}

testApproval();
