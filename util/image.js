const handleImageUpload = async (file) => {
    const formData = new URLSearchParams()
    formData.append('file', file)
    formData.append('upload_preset', "pmfoqhny")
    const response = await fetch('https://api.cloudinary.com/v1_1/bowerman-cdn/image/upload', {
        'method': 'POST',
        'body': formData
    })
    return response.json()
}

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
}

export {handleImageUpload, blobToBase64}