import axios from "axios";
import { useState, useRef } from "react";
import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import './UploadFile.css'

const UploadFile = () => {
  const [file, setFile] = useState();
  const fileOk = useRef(0);
  const subject = useRef("");
  const teacher = useRef("");
  const year = useRef("");
  const type = useRef("");
  const grade = useRef("");
  const [canUpload, setCanUpload] = useState(false);

  const checkCanUpload = () => {
    if (fileOk.current === 1 && subject.current !== "" && teacher.current !== "" &&
      year.current !== "" && type.current !== "" && grade.current !== "" &&
      grade.current !== "pleaseChoose" && type.current !== "pleaseChoose") {
      setCanUpload(true)
    } else {
      setCanUpload(false)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      fileOk.current = 1
    }
    if (e.target.files.length === 0) {
      fileOk.current = 0
    }
    checkCanUpload();
  }

  async function handleUploadClick(e) {
    e.preventDefault();

    if (!file) {
      return;
    }

    const formdata = new FormData();
    formdata.append("files", file);
    formdata.append("grade", grade.current);
    formdata.append("subject", subject.current);
    formdata.append("teacher", teacher.current);
    formdata.append("year", year.current);
    formdata.append("type", type.current);
    formdata.append("filename", file.name);

    const response = await fetch('/api/user-upload-file', {
      method: 'POST',
      body: formdata,
    }).then(res => res.json())
      .catch(err => {
        console.log(err);
      })

    if (response.message === 'Invalid file!') {
      alert('Invalid file type!')
    } else if (response.message === 'Success!') {
      alert('Upload successfully!')
      window.location.reload()
    } else if (response.message === 'Invalid user!') {
      alert('Invalid user! Maybe you are not using an NYCU account.')
    }
  }

  const handleSubjectChange = (e) => {
    subject.current = e.target.value;
    checkCanUpload();
  }

  const handleTeacherChange = (e) => {
    teacher.current = e.target.value;
    checkCanUpload();
  }

  const handleYearChange = (e) => {
    year.current = e.target.value;
    checkCanUpload();
  }

  const handleTypeChange = (e) => {
    type.current = e.target.value;
    checkCanUpload();
  }

  const handleGradeChange = (e) => {
    grade.current = e.target.value;
    checkCanUpload();
  }

  return (
    <Form style={{ width: '80%', marginTop: '10vh' }} className="ms-auto me-auto mb-5">
      <Row>
        <Col lg='3' className="me-5 mb-4">
          <Form.Group>
            <Form.Label style={{ fontSize: '25px' }}>年級</Form.Label>
            <Form.Select aria-label="grade" onChange={handleGradeChange}>
              <option value='pleaseChoose'>--請選擇年級--</option>
              <option value='大一'>大一</option>
              <option value='大二'>大二</option>
              <option value='大三以上選修'>大三以上</option>
              <option value='通識與其他'>通識與其他</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col className="me-5 mb-4" lg='3'>
          <Form.Group>
            <Form.Label style={{ fontSize: '25px' }}>科目全名</Form.Label>
            <Form.Control
              type='text'
              onChange={handleSubjectChange}
              placeholder="Ex. 微積分(一)"
              required
            />
          </Form.Group>
        </Col>
        <Col className="me-5 mb-4" lg='3'>
          <Form.Group>
            <Form.Label style={{ fontSize: '25px' }}>教師姓名</Form.Label>
            <Form.Control
              type='text'
              onChange={handleTeacherChange}
              placeholder="Ex. 莊重"
              required
            />
          </Form.Group>
        </Col>
        <Col className="me-5 mb-4" lg='3'>
          <Form.Group>
            <Form.Label style={{ fontSize: '25px' }}>學年度</Form.Label>
            <Form.Control
              type='text'
              onChange={handleYearChange}
              placeholder="Ex. 111"
              required
            />
          </Form.Group>
        </Col>
        <Col className="me-5 mb-4" lg='3'>
          <Form.Group>
            <Form.Label style={{ fontSize: '25px' }}>類別</Form.Label>
            <Form.Select aria-label="type" onChange={handleTypeChange} required>
              <option value='pleaseChoose'>--請選擇類別--</option>
              <option value='小考'>小考</option>
              <option value='期中考'>期中考</option>
              <option value='期末考'>期末考</option>
              <option value='上機'>上機</option>
              <option value='講義'>講義</option>
              <option value='作業'>作業</option>
              <option value='其他'>其他</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col className="me-5 mb-4" lg='3'>
          <Form.Group>
            <Form.Label style={{ fontSize: '25px' }}>檔案</Form.Label>
            <Form.Control
              type='file'
              onChange={handleFileChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Button
        type='submit'
        disabled={!canUpload}
        onClick={handleUploadClick}
        className="mt-2"
      >
        送出
      </Button>
    </Form>
  )
}

export default UploadFile;