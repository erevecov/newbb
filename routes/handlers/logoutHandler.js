const logout = function(request, reply) {
    
    request.cookieAuth.clear();
    return reply.redirect('/home');
};
export default logout;