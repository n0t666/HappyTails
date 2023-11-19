function fill(icon_element)
{

    if (icon_element.classList.contains("btn-outline-danger"))
    {
        icon_element.classList.remove("btn-outline-danger");
        icon_element.classList.add("btn-danger");
    }else{
        icon_element.classList.remove("btn-danger");
        icon_element.classList.add("btn-outline-danger");
    }
    

}