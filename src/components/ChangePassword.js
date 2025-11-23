import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { update_password } from '../reduxData/user/userAction';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';

const ChangePassword = ({ user }) => {
    const dispatch = useDispatch();
    const [formdata, setFormdata] = useState({ password: '', newpassword: '', confirmpassword: '' });
    const [errors, setErrors] = useState({ password: '', newpassword: '', confirmpassword: '' });
    const [showPass, setshowPass] = useState(false);
    const [newPass, setnewPass] = useState(false);
    const [confirmPass, setconfirmPass] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'password':
                setErrors({ ...errors, password: value === '' ? 'Current Password is Required' : '' });
                setFormdata({ ...formdata, password: value.replace(/\s/g, "") });
                break;
            case 'newpassword':
                setErrors({ ...errors, newpassword: value === '' ? 'New Pasword is required' : value?.length < 6 ? 'Password length should be more than 5 characters' : value === formdata?.password ? 'New Password must be different from current password' : '' });
                setFormdata({ ...formdata, newpassword: value.replace(/\s/g, "") });
                break;
            case 'confirmpassword':
                setErrors({ ...errors, confirmpassword: value === '' ? 'Confirm Password is required' : value !== formdata?.newpassword ? 'Confirm Password doesnot match' : '' });
                setFormdata({ ...formdata, confirmpassword: value.replace(/\s/g, "") });
                break;

            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { password, newpassword, confirmpassword } = formdata;
        setErrors({
            password: !password ? "Password is required" : "",
            newpassword: !newpassword ? "New Password is required" : newpassword === password ? "New Password must be different from current password" : "",
            confirmpassword: !confirmpassword ? "Confirm Password is required" : confirmpassword !== newpassword ? 'Confirm Password doesnot match' : "",
        });

        if (password && password !== newpassword && newpassword === confirmpassword) {
            const userdata = { currentPassword: password, newPassword: newpassword };
            let passupdated = await update_password(userdata, localStorage.getItem("token"), dispatch);
            //  get_user_profile(dispatch, user);
            if (passupdated) {
                setFormdata({ password: '', newpassword: '', confirmpassword: '' });
                setErrors({ password: '', newpassword: '', confirmpassword: '' });
            }
        }
    };
    return (
        <div>
            <div className="container">
                <h3 className="mb-0 fw-600">Change Password</h3>
            </div>
            <div className='p-4'>
                <Form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label className="text-dark fw-600 mb-1">Current Password</label>
                        <div className="password position-relative">
                            <input
                                type={showPass ? 'text' : 'password'}
                                name="password"
                                className="form-control"
                                placeholder="************"
                                value={formdata?.password}
                                onChange={handleChange}
                                onKeyDown={(e) => e.key === " " && e.preventDefault()}
                            />
                            {!showPass ? (<i class="fas fa-eye-slash" onClick={() => setshowPass(!showPass)}></i>)
                                : (<i class="fas fa-eye" onClick={() => setshowPass(!showPass)}></i>)}
                        </div>
                        {errors.password && <p className="error-msg text-danger">{errors.password}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="text-dark fw-600 mb-1">New Password</label>
                        <div className="password position-relative">
                            <input
                                type={newPass ? "text" : "password"}
                                name="newpassword"
                                className="form-control"
                                placeholder="************"
                                value={formdata?.newpassword}
                                onChange={handleChange}
                                onKeyDown={(e) => e.key === " " && e.preventDefault()}
                            />
                            {!newPass ? (<i class="fas fa-eye-slash" onClick={() => setnewPass(!newPass)}></i>)
                                : (<i class="fas fa-eye" onClick={() => setnewPass(!newPass)}></i>)}
                        </div>
                        {errors.newpassword && <p className="error-msg text-danger">{errors.newpassword}</p>}

                    </div>
                    <div className="mb-3">
                        <label className="text-dark fw-600 mb-1">Confirm Password</label>
                        <div className="password position-relative">
                            <input
                                type={confirmPass ? 'text' : 'password'}
                                name="confirmpassword"
                                className="form-control"
                                placeholder="************"
                                value={formdata?.confirmpassword}
                                onChange={handleChange}
                                onKeyDown={(e) => e.key === " " && e.preventDefault()}
                            />
                            {!confirmPass ? (<i class="fas fa-eye-slash" onClick={() => setconfirmPass(!confirmPass)}></i>)
                                : (<i class="fas fa-eye" onClick={() => setconfirmPass(!confirmPass)}></i>)}
                        </div>
                        {errors.confirmpassword && <p className="error-msg text-danger">{errors.confirmpassword}</p>}

                    </div>

                    <button type="submit" className="btn common-button">
                        Change Password
                    </button>
                </Form>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}
export default connect(mapStateToProps)(ChangePassword);