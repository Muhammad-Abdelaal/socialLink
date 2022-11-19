import { useRef, useState, useContext } from 'react';
import Context from '../../store/Context';
import classes from './EditForm.module.css';

import { v4 } from 'uuid';

import { db, storage } from '../../Firebase/firebase';
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


function EditForm() {
    const [editFeedbackState, setEditFeedbackState] = useState({ state: false, error: null });
    const [editFeedback, setEditFeedback] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const ctx = useContext(Context);
    const userRef = doc(db, "usersData", ctx.uid);
    const [formState, setFormState] = useState(null)
    const countryRef = useRef();
    const usernameRef = useRef();
    const aboutRef = useRef();
    const [ day, setDay] = useState('');
    const [ month, setMonth] = useState('');
    const [ year, setYear] = useState('');

    function formStateHandler(state) {
        if (state === 'pfp') {
            setFormState('pfp')
        }
        else if (state === 'pfcover') {
            setFormState('pfcover')
        }
        else if (state === 'username') {
            setFormState('username')
        }
        else if (state === 'about') {
            setFormState('about')
        }
        else if (state === 'dob') {
            setFormState('dob')
        }
        else if (state === 'cob') {
            setFormState('cob')
        }
    }

    function submiteHandler(e) {
        e.preventDefault();

        if (formState === 'pfp') {
            let imageURL;
            const file = e.target[0].files[0];
            setIsLoading(true)
            const storageRef = file !== undefined ? ref(storage, `${ctx.uid}/pfps/${file.name}${v4()}`) : '';
            const uploadImage = file !== undefined ? uploadBytesResumable(storageRef, file) : '';
            if (file) {
                uploadImage.on('state_changed',
                    null, null,
                    () => {
                        getDownloadURL(uploadImage.snapshot.ref).then(async (downloadURL) => {
                            imageURL = downloadURL;
                            updateDoc(userRef, {
                                "profilePictures.profilePicture": imageURL
                            })
                            setIsLoading(false)
                            setEditFeedbackState({ state: true, error: false });
                            setEditFeedback('Profile picture has been changed successfully')
                            setTimeout(() => {
                                setEditFeedbackState({ state: false, error: null });
                                setEditFeedback('');
                            }, 3000);

                        });
                    }
                );
            }
            else {
                setEditFeedbackState({ state: true, error: true });
                setEditFeedback("No file has been selected")
                setTimeout(() => {
                    setEditFeedbackState({ state: false, error: null });
                    setEditFeedback('');
                }, 3000);
            }
        }
        else if (formState === 'pfcover') {
            let imageURL;
            const file = e.target[0].files[0];
            setIsLoading(true)
            const storageRef = file !== undefined ? ref(storage, `${ctx.uid}/pfcovers/${file.name}${v4()}`) : '';
            const uploadImage = file !== undefined ? uploadBytesResumable(storageRef, file) : '';
            if (file) {
                uploadImage.on('state_changed',
                    null, null,
                    () => {
                        getDownloadURL(uploadImage.snapshot.ref).then(async (downloadURL) => {
                            imageURL = downloadURL;
                            updateDoc(userRef, {
                                "profilePictures.profileCover": imageURL
                            })
                            setIsLoading(false)
                            setEditFeedbackState({ state: true, error: false });
                            setEditFeedback('Profile cover picture has been changed successfully')
                            setTimeout(() => {
                                setEditFeedbackState({ state: false, error: null });
                                setEditFeedback('');
                            }, 3000);

                        });
                    }
                );
            }
            else {
                setEditFeedbackState({ state: true, error: true });
                setEditFeedback("No file has been selected")
                setTimeout(() => {
                    setEditFeedbackState({ state: false, error: null });
                    setEditFeedback('');
                }, 3000);
            }
        }
        else if (formState === 'username') {
            if (usernameRef.current.value !== '') {
                updateDoc(userRef, {
                    "userInfo.userName": usernameRef.current.value
                })
                usernameRef.current.value = '';
                setEditFeedbackState({ state: true, error: false });
                setEditFeedback('Username has been changed successfully')
                setTimeout(() => {
                    setEditFeedbackState({ state: false, error: null });
                    setEditFeedback('');
                }, 3000);
            }
            else {
                setEditFeedbackState({ state: true, error: true });
                setEditFeedback("Username can't be EMPTY")
                setTimeout(() => {
                    setEditFeedbackState({ state: false, error: null });
                    setEditFeedback('');
                }, 3000);
            }
        }
        else if (formState === 'about') {
            if (aboutRef.current.value !== '') {
                updateDoc(userRef, {
                    "userInfo.userAbout": aboutRef.current.value
                })
                aboutRef.current.value = '';
                setEditFeedbackState(true);
                setEditFeedback('user " ABOUT " has been changed successfully')
                setTimeout(() => {
                    setEditFeedbackState(false);
                    setEditFeedback('');
                }, 3000);
            }
            else {
                updateDoc(userRef, {
                    "userInfo.userAbout": aboutRef.current.value
                })
                aboutRef.current.value = '';
                setEditFeedbackState(true);
                setEditFeedback('user " ABOUT " has been removed successfully')
                setTimeout(() => {
                    setEditFeedbackState(false);
                    setEditFeedback('');
                }, 3000);
            }
        }
        else if (formState === 'dob') {
            if (day !== '' && month !== '' && year !== '') {
                const formattedDay = day === (1) ? '1st' : day === (2) ? '2nd' :
                    day === (3) ? '3rd' : `${day}th`;
                const formattedMonth = month === '1' ? 'Jan.' : month === '2' ? 'Feb.' :
                    month === '3' ? 'Mar' : month === '4' ? 'Apr.' :
                        month === '5' ? 'May' : month === '6' ? 'Jun.' :
                            month === '7' ? 'Jul.' : month === '8' ? 'Aug.' :
                                month === '9' ? 'Sep.' : month === '10' ? 'Oct.' :
                                    month === '11' ? 'Nov.' : 'Dec.';


                updateDoc(userRef, {
                    "userInfo.dob": `${formattedDay}  ${formattedMonth}  ${year}`
                })
                setDay('') ;
                setMonth('') ;
                setYear('') ;
                setEditFeedbackState({ state: true, error: true });
                setEditFeedback('Date of birth has been changed successfully')
                setTimeout(() => {
                    setEditFeedbackState({ state: false, error: null });
                    setEditFeedback('');
                }, 3000);
            }
            else {
                setEditFeedbackState({ state: true, error: true });
                setEditFeedback("Please fill all input fields")
                setTimeout(() => {
                    setEditFeedbackState({ state: false, error: null });
                    setEditFeedback('');
                }, 3000);
            }
        }
        else if (formState === 'cob') {
            setIsLoading(true)
            updateDoc(userRef, {
                "userInfo.From": countryRef.current.value
            })
            setIsLoading(false)
            setEditFeedbackState({ state: true, error: false });
            setEditFeedback('Country of birth has been changed successfully')
            setTimeout(() => {
                setEditFeedbackState({ state: false, error: null });
                setEditFeedback('');
            }, 3000);
        }
    }

    function onlyNumbers(e, setInputState) {
        const re = /^[0-9\b]+$/;

        if (e.target.value === '' || re.test(e.target.value)) {
            setInputState(e.target.value) 
        }
    }
    return (
        <form onSubmit={submiteHandler} className={classes['edit-form']}>
            <h1 style={{ marginBottom: '30px', color: 'white' }}>Edit Profile</h1>
            <div className={classes['profile-info-to-edit']}>
                <div onClick={() => { formStateHandler('pfp') }}>Change profile picture</div>
                <div onClick={() => { formStateHandler('pfcover') }}>Change profile cover</div>
                <div onClick={() => { formStateHandler('username') }}>Change Username</div>
                <div onClick={() => { formStateHandler('about') }}>Change About</div>
                <div onClick={() => { formStateHandler('dob') }}>Change date of birth</div>
                <div onClick={() => { formStateHandler('cob') }}>Change country of birth</div>
            </div>
            {formState === 'pfp' ?
                <div className={classes['edit-image-container']}>
                    <label className={classes['input-label']}>Profile picture</label>
                    <input className={classes['file-input']} accept="image/png, image/jpeg" type={'file'} />
                </div> : formState === 'pfcover' ?
                    <div className={classes['edit-image-container']}>
                        <label className={classes['input-label']}>Profile Cover</label>
                        <input className={classes['file-input']} accept="image/png, image/jpeg" type={'file'} />
                    </div> : formState === 'username' ?
                        <div className={classes['label-input-container']}>
                            <label className={classes['input-label']}>Username</label>
                            <input maxLength={32} ref={usernameRef} placeholder='username' type={'text'} />
                        </div> : formState === 'about' ?
                            <div className={classes['label-input-container']}>
                                <label className={classes['input-label']}>About</label>
                                <input ref={aboutRef} placeholder='about' type={'text'} />
                            </div> : formState === 'dob' ?
                                <div className={classes['label-input-container']}>
                                    <label className={classes['input-label']}>Date of birth</label>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <input onChange={(e)=>{onlyNumbers(e,setDay)}} value = {day}  maxLength='2' placeholder='dd' type={'text'} />
                                        <input onChange={(e)=>{onlyNumbers(e,setMonth)}} value = {month}  maxLength='2' placeholder='mm' type={'text'} />
                                        <input onChange={(e)=>{onlyNumbers(e,setYear)}} value = {year}  maxLength='4' minLength='4' placeholder='yyyy' type={'text'} />
                                    </div>
                                </div> : formState === 'cob' ?
                                    <div className={classes['label-input-container']}>
                                        <label className={classes['input-label']}>Country of birth</label>
                                        <select ref={countryRef} id="country" name="country" >
                                            <option value="Afghanistan">Afghanistan</option>
                                            <option value="Åland Islands">Åland Islands</option>
                                            <option value="Albania">Albania</option>
                                            <option value="Algeria">Algeria</option>
                                            <option value="American Samoa">American Samoa</option>
                                            <option value="Andorra">Andorra</option>
                                            <option value="Angola">Angola</option>
                                            <option value="Anguilla">Anguilla</option>
                                            <option value="Antarctica">Antarctica</option>
                                            <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                            <option value="Argentina">Argentina</option>
                                            <option value="Armenia">Armenia</option>
                                            <option value="Aruba">Aruba</option>
                                            <option value="Australia">Australia</option>
                                            <option value="Austria">Austria</option>
                                            <option value="Azerbaijan">Azerbaijan</option>
                                            <option value="Bahamas">Bahamas</option>
                                            <option value="Bahrain">Bahrain</option>
                                            <option value="Bangladesh">Bangladesh</option>
                                            <option value="Barbados">Barbados</option>
                                            <option value="Belarus">Belarus</option>
                                            <option value="Belgium">Belgium</option>
                                            <option value="Belize">Belize</option>
                                            <option value="Benin">Benin</option>
                                            <option value="Bermuda">Bermuda</option>
                                            <option value="Bhutan">Bhutan</option>
                                            <option value="Bolivia">Bolivia</option>
                                            <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                            <option value="Botswana">Botswana</option>
                                            <option value="Bouvet Island">Bouvet Island</option>
                                            <option value="Brazil">Brazil</option>
                                            <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                                            <option value="Brunei Darussalam">Brunei Darussalam</option>
                                            <option value="Bulgaria">Bulgaria</option>
                                            <option value="Burkina Faso">Burkina Faso</option>
                                            <option value="Burundi">Burundi</option>
                                            <option value="Cambodia">Cambodia</option>
                                            <option value="Cameroon">Cameroon</option>
                                            <option value="Canada">Canada</option>
                                            <option value="Cape Verde">Cape Verde</option>
                                            <option value="Cayman Islands">Cayman Islands</option>
                                            <option value="Central African Republic">Central African Republic</option>
                                            <option value="Chad">Chad</option>
                                            <option value="Chile">Chile</option>
                                            <option value="China">China</option>
                                            <option value="Christmas Island">Christmas Island</option>
                                            <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                                            <option value="Colombia">Colombia</option>
                                            <option value="Comoros">Comoros</option>
                                            <option value="Congo">Congo</option>
                                            <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                                            <option value="Cook Islands">Cook Islands</option>
                                            <option value="Costa Rica">Costa Rica</option>
                                            <option value="Cote D'ivoire">Cote D'ivoire</option>
                                            <option value="Croatia">Croatia</option>
                                            <option value="Cuba">Cuba</option>
                                            <option value="Cyprus">Cyprus</option>
                                            <option value="Czech Republic">Czech Republic</option>
                                            <option value="Denmark">Denmark</option>
                                            <option value="Djibouti">Djibouti</option>
                                            <option value="Dominica">Dominica</option>
                                            <option value="Dominican Republic">Dominican Republic</option>
                                            <option value="Ecuador">Ecuador</option>
                                            <option value="Egypt">Egypt</option>
                                            <option value="El Salvador">El Salvador</option>
                                            <option value="Equatorial Guinea">Equatorial Guinea</option>
                                            <option value="Eritrea">Eritrea</option>
                                            <option value="Estonia">Estonia</option>
                                            <option value="Ethiopia">Ethiopia</option>
                                            <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                                            <option value="Faroe Islands">Faroe Islands</option>
                                            <option value="Fiji">Fiji</option>
                                            <option value="Finland">Finland</option>
                                            <option value="France">France</option>
                                            <option value="French Guiana">French Guiana</option>
                                            <option value="French Polynesia">French Polynesia</option>
                                            <option value="French Southern Territories">French Southern Territories</option>
                                            <option value="Gabon">Gabon</option>
                                            <option value="Gambia">Gambia</option>
                                            <option value="Georgia">Georgia</option>
                                            <option value="Germany">Germany</option>
                                            <option value="Ghana">Ghana</option>
                                            <option value="Gibraltar">Gibraltar</option>
                                            <option value="Greece">Greece</option>
                                            <option value="Greenland">Greenland</option>
                                            <option value="Grenada">Grenada</option>
                                            <option value="Guadeloupe">Guadeloupe</option>
                                            <option value="Guam">Guam</option>
                                            <option value="Guatemala">Guatemala</option>
                                            <option value="Guernsey">Guernsey</option>
                                            <option value="Guinea">Guinea</option>
                                            <option value="Guinea-bissau">Guinea-bissau</option>
                                            <option value="Guyana">Guyana</option>
                                            <option value="Haiti">Haiti</option>
                                            <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                                            <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                                            <option value="Honduras">Honduras</option>
                                            <option value="Hong Kong">Hong Kong</option>
                                            <option value="Hungary">Hungary</option>
                                            <option value="Iceland">Iceland</option>
                                            <option value="India">India</option>
                                            <option value="Indonesia">Indonesia</option>
                                            <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                                            <option value="Iraq">Iraq</option>
                                            <option value="Ireland">Ireland</option>
                                            <option value="Isle of Man">Isle of Man</option>
                                            <option value="Israel">Israel</option>
                                            <option value="Italy">Italy</option>
                                            <option value="Jamaica">Jamaica</option>
                                            <option value="Japan">Japan</option>
                                            <option value="Jersey">Jersey</option>
                                            <option value="Jordan">Jordan</option>
                                            <option value="Kazakhstan">Kazakhstan</option>
                                            <option value="Kenya">Kenya</option>
                                            <option value="Kiribati">Kiribati</option>
                                            <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                                            <option value="Korea, Republic of">Korea, Republic of</option>
                                            <option value="Kuwait">Kuwait</option>
                                            <option value="Kyrgyzstan">Kyrgyzstan</option>
                                            <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                                            <option value="Latvia">Latvia</option>
                                            <option value="Lebanon">Lebanon</option>
                                            <option value="Lesotho">Lesotho</option>
                                            <option value="Liberia">Liberia</option>
                                            <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                                            <option value="Liechtenstein">Liechtenstein</option>
                                            <option value="Lithuania">Lithuania</option>
                                            <option value="Luxembourg">Luxembourg</option>
                                            <option value="Macao">Macao</option>
                                            <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                                            <option value="Madagascar">Madagascar</option>
                                            <option value="Malawi">Malawi</option>
                                            <option value="Malaysia">Malaysia</option>
                                            <option value="Maldives">Maldives</option>
                                            <option value="Mali">Mali</option>
                                            <option value="Malta">Malta</option>
                                            <option value="Marshall Islands">Marshall Islands</option>
                                            <option value="Martinique">Martinique</option>
                                            <option value="Mauritania">Mauritania</option>
                                            <option value="Mauritius">Mauritius</option>
                                            <option value="Mayotte">Mayotte</option>
                                            <option value="Mexico">Mexico</option>
                                            <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                                            <option value="Moldova, Republic of">Moldova, Republic of</option>
                                            <option value="Monaco">Monaco</option>
                                            <option value="Mongolia">Mongolia</option>
                                            <option value="Montenegro">Montenegro</option>
                                            <option value="Montserrat">Montserrat</option>
                                            <option value="Morocco">Morocco</option>
                                            <option value="Mozambique">Mozambique</option>
                                            <option value="Myanmar">Myanmar</option>
                                            <option value="Namibia">Namibia</option>
                                            <option value="Nauru">Nauru</option>
                                            <option value="Nepal">Nepal</option>
                                            <option value="Netherlands">Netherlands</option>
                                            <option value="Netherlands Antilles">Netherlands Antilles</option>
                                            <option value="New Caledonia">New Caledonia</option>
                                            <option value="New Zealand">New Zealand</option>
                                            <option value="Nicaragua">Nicaragua</option>
                                            <option value="Niger">Niger</option>
                                            <option value="Nigeria">Nigeria</option>
                                            <option value="Niue">Niue</option>
                                            <option value="Norfolk Island">Norfolk Island</option>
                                            <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                                            <option value="Norway">Norway</option>
                                            <option value="Oman">Oman</option>
                                            <option value="Pakistan">Pakistan</option>
                                            <option value="Palau">Palau</option>
                                            <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                                            <option value="Panama">Panama</option>
                                            <option value="Papua New Guinea">Papua New Guinea</option>
                                            <option value="Paraguay">Paraguay</option>
                                            <option value="Peru">Peru</option>
                                            <option value="Philippines">Philippines</option>
                                            <option value="Pitcairn">Pitcairn</option>
                                            <option value="Poland">Poland</option>
                                            <option value="Portugal">Portugal</option>
                                            <option value="Puerto Rico">Puerto Rico</option>
                                            <option value="Qatar">Qatar</option>
                                            <option value="Reunion">Reunion</option>
                                            <option value="Romania">Romania</option>
                                            <option value="Russian Federation">Russian Federation</option>
                                            <option value="Rwanda">Rwanda</option>
                                            <option value="Saint Helena">Saint Helena</option>
                                            <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                            <option value="Saint Lucia">Saint Lucia</option>
                                            <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                                            <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                                            <option value="Samoa">Samoa</option>
                                            <option value="San Marino">San Marino</option>
                                            <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                            <option value="Saudi Arabia">Saudi Arabia</option>
                                            <option value="Senegal">Senegal</option>
                                            <option value="Serbia">Serbia</option>
                                            <option value="Seychelles">Seychelles</option>
                                            <option value="Sierra Leone">Sierra Leone</option>
                                            <option value="Singapore">Singapore</option>
                                            <option value="Slovakia">Slovakia</option>
                                            <option value="Slovenia">Slovenia</option>
                                            <option value="Solomon Islands">Solomon Islands</option>
                                            <option value="Somalia">Somalia</option>
                                            <option value="South Africa">South Africa</option>
                                            <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                                            <option value="Spain">Spain</option>
                                            <option value="Sri Lanka">Sri Lanka</option>
                                            <option value="Sudan">Sudan</option>
                                            <option value="Suriname">Suriname</option>
                                            <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                                            <option value="Swaziland">Swaziland</option>
                                            <option value="Sweden">Sweden</option>
                                            <option value="Switzerland">Switzerland</option>
                                            <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                                            <option value="Taiwan">Taiwan</option>
                                            <option value="Tajikistan">Tajikistan</option>
                                            <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                                            <option value="Thailand">Thailand</option>
                                            <option value="Timor-leste">Timor-leste</option>
                                            <option value="Togo">Togo</option>
                                            <option value="Tokelau">Tokelau</option>
                                            <option value="Tonga">Tonga</option>
                                            <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                            <option value="Tunisia">Tunisia</option>
                                            <option value="Turkey">Turkey</option>
                                            <option value="Turkmenistan">Turkmenistan</option>
                                            <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                                            <option value="Tuvalu">Tuvalu</option>
                                            <option value="Uganda">Uganda</option>
                                            <option value="Ukraine">Ukraine</option>
                                            <option value="United Arab Emirates">United Arab Emirates</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                            <option value="United States">United States</option>
                                            <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                                            <option value="Uruguay">Uruguay</option>
                                            <option value="Uzbekistan">Uzbekistan</option>
                                            <option value="Vanuatu">Vanuatu</option>
                                            <option value="Venezuela">Venezuela</option>
                                            <option value="Viet Nam">Viet Nam</option>
                                            <option value="Virgin Islands, British">Virgin Islands, British</option>
                                            <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                                            <option value="Wallis and Futuna">Wallis and Futuna</option>
                                            <option value="Western Sahara">Western Sahara</option>
                                            <option value="Yemen">Yemen</option>
                                            <option value="Zambia">Zambia</option>
                                            <option value="Zimbabwe">Zimbabwe</option>
                                        </select>
                                    </div> : ''
            }
            {formState === null ? '' : <button className={classes['submit-button']}>submit</button>}
            {editFeedbackState.state && !isLoading ? <p style={editFeedbackState.error ? { color: 'red', fontSize: '18px', display: 'block', fontWeight: '500', marginTop: '30px' } : { color: 'green', fontSize: '18px', display: 'block', fontWeight: '500', marginTop: '30px' }}>{editFeedback}</p> :
            isLoading && !editFeedbackState.state ? <p style={editFeedbackState.error ? { color: 'red', fontSize: '18px', display: 'block', fontWeight: '500', marginTop: '30px' } : { color: 'green', fontSize: '18px', display: 'block', fontWeight: '500', marginTop: '30px' }}>Sending...</p> :''}
        </form>
    )
}

export default EditForm;