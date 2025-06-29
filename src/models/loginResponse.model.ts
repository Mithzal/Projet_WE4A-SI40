export class loginResponse {
    constructor(
        public token: string,
        public user: {
        _id: string;
        name: string;
        email: string;
        role: string;
        courses: [];
        }
    ) {
        this.token = token;
        this.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            courses: user.courses
        }
    }
}
