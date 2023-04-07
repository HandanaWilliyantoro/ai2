const handleImageUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', "pmfoqhny")
    const response = await fetch('https://api.cloudinary.com/v1_1/bowerman-cdn/image/upload', {
        'method': 'POST',
        'body': formData
    })
    return response.json()
}

export default handleImageUpload