<<<<<<< HEAD
async function testUpdate() {
    try {
        const res = await fetch('http://localhost:5001/api/projects/6829a8cd-7a4a-464d-bd4a-dd475bfcce9d', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: 'test content updated' })
        });

        const data = await res.json();

        if (!res.ok) {
            console.log('Error Status:', res.status);
            console.log('Error Data:', data);
        } else {
            console.log('Success:', data);
        }
    } catch (error) {
        console.log('Error:', error.message);
    }
}

testUpdate();
=======
async function testUpdate() {
    try {
        const res = await fetch('http://localhost:5001/api/projects/6829a8cd-7a4a-464d-bd4a-dd475bfcce9d', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: 'test content updated' })
        });

        const data = await res.json();

        if (!res.ok) {
            console.log('Error Status:', res.status);
            console.log('Error Data:', data);
        } else {
            console.log('Success:', data);
        }
    } catch (error) {
        console.log('Error:', error.message);
    }
}

testUpdate();
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
