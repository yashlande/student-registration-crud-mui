import React, { useEffect } from "react";
import {
    TextField, Box, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, InputLabel, MenuItem, FormGroup,
    Checkbox, Select, Autocomplete, Button, Snackbar, Alert
} from '@mui/material';

import { addStudents, updateInfo, updateStudents } from './../Redux/studentSlice'
import { useSelector, useDispatch } from 'react-redux'


function Form() {

    const updateStatus = useSelector(state => state.students.updateInfo);
    const { status, index } = updateStatus;

    const students = useSelector(state => state.students.studentRecords);

    // console.log("Update Status =", updateStatus)

    const dispatch = useDispatch();

    const options = ['CSE', 'BBA', 'EEE'];

    const [formData, setFormData] = React.useState({
        id: '',
        fullName: '',
        address: '',
        gender: '',
        age: '',
        lang: {
            eng: true,
            hin: false,
        },
        dep: ''
    })

    const clear = {
        id: '',
        fullName: '',
        address: '',
        gender: '',
        age: '',
        lang: {
            eng: true,
            hin: false,
        },
        dep: ''
    }

    const [openSnack, setOpenSnack] = React.useState(false);

    const [value, setValue] = React.useState(options[0]);
    const [inputValue, setInputValue] = React.useState('');

    const [errors, setErrors] = React.useState({
        fnameError: false
    })

    useEffect(() => {
        if (status === true) {
            setFormData({ ...students[index] })
            setValue(students[index].dep)
            // dispatch(updateInfo({
            //     status: false,
            //     index: -1
            // }))
        }

    }, [status])


    const handleFormData = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })

        if (errors.fnameError === true && event.target.name === 'fullName') {
            setErrors({ ...errors, fnameError: false })
        }
    }

    const handleLangChange = (event) => {
        let localLang = formData.lang;
        setFormData({
            ...formData,
            lang: {
                ...localLang,
                [event.target.name]: event.target.checked
            }
        });
    };

    const clearFields = () => {
        setFormData({ ...clear })
        setValue(options[0]);
        setInputValue('')
    }

    const handleSubmit = () => {
        if (status === false) {
            if (formData.fullName != '') {
                formData.id = "id" + Math.random().toString(16).slice(2)
                dispatch(addStudents(formData))
                setOpenSnack(true)
                clearFields()
            } else {
                setErrors({ ...errors, fnameError: true })
            }
        } else {
            if (formData.fullName != '') {
                dispatch(updateStudents({
                    index: index,
                    data: formData
                }))
                clearFields()
                dispatch(updateInfo({
                    status: false,
                    index: -1
                }))
                setOpenSnack(true)
            } else {
                setErrors({ ...errors, fnameError: true })
            }
        }
    }

    const handleSnackClose=()=>{
        setOpenSnack(false)
    }

    const { eng, hin } = formData.lang;
    const { fnameError } = errors;
    return (
        <>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '50ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <div className="innerForm">
                    <TextField
                        error={fnameError}
                        id="outlined-required"
                        label="Full Name"
                        value={formData.fullName}
                        onChange={handleFormData}
                        name="fullName"
                        helperText={fnameError ? 'Please Enter Full Name' : null}
                    />

                    <TextField
                        id="outlined-multiline-flexible"
                        label="Address"
                        multiline
                        maxRows={4}
                        name="address"
                        value={formData.address}
                        onChange={handleFormData}
                    />

                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="gender"
                            value={formData.gender}
                            onChange={handleFormData}
                        >
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
                    </FormControl>

                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-helper-label">Age</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={formData.age}
                            label="Age"
                            name="age"
                            onChange={handleFormData}
                        >
                            <MenuItem value="">
                                <em>Select</em>
                            </MenuItem>
                            <MenuItem value={'10 - 20'}>10-20</MenuItem>
                            <MenuItem value={'21 - 30'}>21-30</MenuItem>
                            <MenuItem value={'31 - 40'}>31-40</MenuItem>
                            <MenuItem value={'41 - 50'}>41-50</MenuItem>
                            <MenuItem value={'51 - 60'}>51-60</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 2 }} component="fieldset" variant="standard">
                        <FormLabel component="legend">Known Languages</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={eng} onChange={handleLangChange} name="eng" />
                                }
                                label="English"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={hin} onChange={handleLangChange} name="hin" />
                                }
                                label="Hindi"
                            />

                        </FormGroup>
                    </FormControl>

                    <Autocomplete
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                            setFormData({
                                ...formData,
                                dep: newValue
                            })
                        }}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        id="controllable-states-demo"
                        name="dep"
                        options={options}
                        // sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Department" />}
                    />
                    <Button variant="contained" onClick={() => handleSubmit()}>{status ? 'Update' : 'Submit'}</Button>
                </div>
            </Box>
            <Snackbar open={openSnack} autoHideDuration={4000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
                    Task Completed Successfully
                </Alert>
            </Snackbar>
        </>
    )
}

export default Form