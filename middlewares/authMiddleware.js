exports.isLogin = (req, res, next) => {
  try {
    if (!req.session.user) {
      if (req.originalUrl === "/dashboard") {
        return res.render("login", { message: "يرجى تسجيل الدخول أولاً" }); // إبقاء المستخدم في صفحة تسجيل الدخول
      }
      return res.redirect("/login"); // إعادة التوجيه للطلبات العادية
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};


exports.isLogout = (req, res, next) => {
  try {
    if (req.session.user) {
      return res.redirect("/dashboard"); 
    }
    return next(); 
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

