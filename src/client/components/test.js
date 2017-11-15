 {/*
<nav className="navbar has-shadow">
    <div className="container">
        <nav className="tabs is-large">
            <Link className={"navbar-item is-tab " + select.product} 
                onClick={this.tabActive.bind(this, 'product')} to="/">產品列表</Link>
            <Link className={"navbar-item is-tab " + select.login} 
                onClick={this.tabActive.bind(this, 'login')} to="/login">會員登入</Link>
            <Link className={"navbar-item is-tab " + select.register} 
                onClick={this.tabActive.bind(this, 'register')} to="/register">會員註冊</Link>
            <Link className={"navbar-item is-tab " + select.contact}
                onClick={this.tabActive.bind(this, 'contact')} to="/contact">聯絡我們</Link>
            {auth && <Link className={"navbar-item is-tab " + select.order}
                onClick={this.tabActive.bind(this, 'order')} to="/order">訂購清單</Link>}
        </nav>
    </div>
</nav>
<div className="container" style={style.container}>
    <Route exact path="/" component={Product}/>
    <Route path="/login" component={Login}/>
    <Route path="/register" component={Register}/>
    <Route path="/contact" component={Contact}/>
    <Route path="/order" component={Order}/>
</div>
*/}