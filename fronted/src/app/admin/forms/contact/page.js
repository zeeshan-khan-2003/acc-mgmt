"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function Page() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    Contactname: "",
    phoneNumber: "",
    email: "",
    Adress: ""
  })

  const [errors, setErrors] = useState({
    Contactname: "",
    phoneNumber: "",
    email: "",
    Adress: "",
    general: ""
  })

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const handleChange = e => {
    const { id, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }))

    setErrors(prevErrors => ({
      ...prevErrors,
      [id]: "",
      general: ""
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    let valid = true
    const newErrors = {
      Contactname: "",
      phoneNumber: "",
      email: "",
      Adress: "",
      general: ""
    }

    if (!formData.Contactname.trim()) {
      newErrors.Contactname = "Contact name is required"
      valid = false
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
      valid = false
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number (must be 10 digits)"
      valid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address"
      valid = false
    }

    if (!formData.Adress.trim()) {
      newErrors.Adress = "Address is required"
      valid = false
    }

    if (!valid) {
      setErrors(newErrors)
      return
    }

    const token = localStorage.getItem('jwtToken')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.Contactname,
          mobile: formData.phoneNumber,
          email: formData.email,
          city: formData.Adress // Mapping Adress to city for now
        })
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.msg || 'Failed to create contact')
      }

      console.log("Contact created successfully:", result)
      alert("Contact created successfully!")

      // Reset form
      setFormData({
        Contactname: "",
        phoneNumber: "",
        email: "",
        Adress: ""
      })

      setErrors({
        Contactname: "",
        phoneNumber: "",
        email: "",
        Adress: "",
        general: ""
      })

    } catch (error) {
      setErrors(prevErrors => ({
        ...prevErrors,
        general: error.message || "An unexpected error occurred."
      }))
    }
  }

  return (
    <>
        <div className="w-full max-w-md">
          <h2 className="text-center text-lg font-semibold mb-4">Contact</h2>
          <Card className="w-full max-w-md mx-auto">
            {/* <CardHeader>
            </CardHeader> */}
            <CardContent>
              <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <Label htmlFor="Contactname" className="mb-2">
                    Contact Name
                  </Label>
                  <Input
                    id="Contactname"
                    placeholder="John Doe"
                    value={formData.Contactname}
                    onChange={handleChange}
                  />
                  {errors.Contactname && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.Contactname}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="phoneNumber" className="mb-2">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    placeholder="1234567890"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="email" className="mb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="Adress" className="mb-2">
                    Address
                  </Label>
                  <Input
                    id="Adress"
                    placeholder="123 Main Street"
                    value={formData.Adress}
                    onChange={handleChange}
                  />
                  {errors.Adress && (
                    <p className="mt-1 text-sm text-red-600">{errors.Adress}</p>
                  )}
                </div>

                {errors.general && (
                  <p className="mt-1 text-sm text-red-600">{errors.general}</p>
                )}

                <Button type="submit">Create</Button>
              </form>
            </CardContent>
          </Card>
        </div>
    </>
  )
}
