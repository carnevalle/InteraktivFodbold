if(!me){
    cancel('You are not logged in', 401);
}else if(!me.admin){
    cancel('Only admins are allowed to create objects', 401);
}