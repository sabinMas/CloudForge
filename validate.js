export function validate_upload(data){
    const errors = [];
    if(data.name==''){
        errors.push("Name is required")
    }
    const category_options=[
        "pokemon",
        "magic-the-gathering",
        "yu-gi-oh",
        "basketball",
        "football",
        "basebal",
        "soccer",
    ]
    if(!data.category.includes(category_options)){
        errors.push('Insert Valid Category')
    }
    if(data.rate<1 &&data.rate>10){
        errors.push('Insert valid rating')
    }
    if(data.stat==''){
        errors.push('Stats are required')
    }
    if(!data.price){
        errors.push('Price is required')
    }
    if(data.price && typeof data.price == "number"){
        errors.push("Price must be valid")
    }
    if(data.history==''){
        errors.push("Histpory required")
    }
    return {
        isValid: errors.length === 0,
        errors
    }
}