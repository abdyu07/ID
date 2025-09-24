'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Download, Upload, Eye, Camera } from 'lucide-react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import QRCode from 'qrcode'
import { exportCardAsImage, exportBothCardsAsPDF } from '@/components/robust-export'
interface PersonalData {
  surname: string
  givenNames: string
  sex: string
  nationality: string
  dateOfBirth: string
  placeOfBirth: string
  dateOfIssue: string
  dateOfExpiry: string
  idNumber: string
  address: string
  photo: string
  signature: string
}



export default function IDCardEditor() {
  const [personalData, setPersonalData] = useState<PersonalData>({
    surname: '',
    givenNames: '',
    sex: 'M',
    nationality: 'British Citizen',
    dateOfBirth: '',
    placeOfBirth: '',
    dateOfIssue: '',
    dateOfExpiry: '',
    idNumber: '',
    address: '',
    photo: '',
    signature: ''
  })

  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [tempImage, setTempImage] = useState<string>('')
  const [showCropper, setShowCropper] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const imgRef = useRef<HTMLImageElement>(null)
  const cardFrontRef = useRef<HTMLDivElement>(null)
  const cardBackRef = useRef<HTMLDivElement>(null)

  const updateField = (field: keyof PersonalData, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setTempImage(reader.result as string)
        setShowCropper(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const getCroppedImg = useCallback(
    (image: HTMLImageElement, crop: PixelCrop): Promise<string> => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No 2d context')
      }

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      canvas.width = crop.width
      canvas.height = crop.height

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      )

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('Canvas is empty')
          }
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(blob)
        }, 'image/jpeg', 0.95)
      })
    },
    []
  )

  const applyCrop = async () => {
    if (imgRef.current && completedCrop) {
      try {
        const croppedImageUrl = await getCroppedImg(imgRef.current, completedCrop)
        updateField('photo', croppedImageUrl)
        setShowCropper(false)
        setTempImage('')
      } catch (error) {
        console.error('Error cropping image:', error)
      }
    }
  }

  const generateQRCode = async () => {
    const qrData = {
      name: `${personalData.givenNames} ${personalData.surname}`,
      id: personalData.idNumber,
      dob: personalData.dateOfBirth,
      nationality: personalData.nationality
    }
    
    try {
      const qrUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 100,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCodeUrl(qrUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const exportToPNG = async (elementId: string, filename: string) => {
    await exportCardAsImage(elementId, filename)
  }

  const exportToPDF = async () => {
    await exportBothCardsAsPDF()
  }

  // Generate QR code when data changes
  React.useEffect(() => {
    if (personalData.idNumber && personalData.surname) {
      generateQRCode()
    }
  }, [personalData.idNumber, personalData.surname, personalData.givenNames, personalData.dateOfBirth])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">UK Digital ID Card Editor</h1>
          <p className="text-gray-600">Create and customize your digital identification card</p>
          <Badge variant="outline" className="mt-2">For Educational Purposes Only</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="dates">Dates</TabsTrigger>
                    <TabsTrigger value="photo">Photo</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="surname">Surname/Nom</Label>
                        <Input
                          id="surname"
                          value={personalData.surname}
                          onChange={(e) => updateField('surname', e.target.value)}
                          placeholder="Henderson"
                        />
                      </div>
                      <div>
                        <Label htmlFor="givenNames">Given Names/Prénoms</Label>
                        <Input
                          id="givenNames"
                          value={personalData.givenNames}
                          onChange={(e) => updateField('givenNames', e.target.value)}
                          placeholder="Elizabeth"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sex">Sex/Sexe</Label>
                        <Select value={personalData.sex} onValueChange={(value) => updateField('sex', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">M</SelectItem>
                            <SelectItem value="F">F</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="nationality">Nationality/Nationalité</Label>
                        <Input
                          id="nationality"
                          value={personalData.nationality}
                          onChange={(e) => updateField('nationality', e.target.value)}
                          placeholder="British Citizen"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input
                        id="idNumber"
                        value={personalData.idNumber}
                        onChange={(e) => updateField('idNumber', e.target.value)}
                        placeholder="123456789"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address/Adresse</Label>
                      <Textarea
                        id="address"
                        value={personalData.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        placeholder="London"
                        rows={2}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dates" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={personalData.dateOfBirth}
                          onChange={(e) => updateField('dateOfBirth', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="placeOfBirth">Place of Birth</Label>
                        <Input
                          id="placeOfBirth"
                          value={personalData.placeOfBirth}
                          onChange={(e) => updateField('placeOfBirth', e.target.value)}
                          placeholder="London"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateOfIssue">Date of Issue</Label>
                        <Input
                          id="dateOfIssue"
                          type="date"
                          value={personalData.dateOfIssue}
                          onChange={(e) => updateField('dateOfIssue', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfExpiry">Date of Expiry</Label>
                        <Input
                          id="dateOfExpiry"
                          type="date"
                          value={personalData.dateOfExpiry}
                          onChange={(e) => updateField('dateOfExpiry', e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="photo" className="space-y-4">
                    <div>
                      <Label htmlFor="photo">Upload Photo</Label>
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                      />
                    </div>
                    
                    {personalData.photo && (
                      <div className="text-center">
                        <img
                          src={personalData.photo}
                          alt="ID Photo"
                          className="w-32 h-40 object-cover border-2 border-gray-300 rounded mx-auto"
                        />
                        <p className="text-sm text-gray-500 mt-2">Current photo</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Export Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={() => exportToPNG("card-front", "id-card-front.png")} variant="outline">
                    Export Front PNG
                  </Button>
                  <Button onClick={() => exportToPNG("card-back", "id-card-back.png")} variant="outline">
                    Export Back PNG
                  </Button>
                  <Button onClick={exportToPDF} className="col-span-2">
                    Export Both Sides PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Front Side */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Front Side</h3>
                    <div 
                      ref={cardFrontRef}
                      id="card-front"
                      className="relative w-full h-64 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 rounded-lg border-2 border-gray-300 overflow-hidden"
                      style={{
                        backgroundImage: `
                          radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%),
                          linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)
                        `
                      }}
                    >
                      {/* Holographic overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                      
                      {/* Header */}
                      <div className="absolute top-2 left-4 right-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-4 bg-gray-600 rounded-sm flex items-center justify-center">
                            <div className="w-3 h-2 border border-white rounded-full"></div>
                          </div>
                          <span className="text-xs font-bold text-gray-700">UNITED KINGDOM</span>
                        </div>
                        <span className="text-sm font-bold text-gray-800">{personalData.idNumber}</span>
                      </div>
                      
                      <div className="absolute top-8 right-4 text-xs font-bold text-gray-800">
                        National Identity Card
                      </div>
                      
                      {/* Photo */}
                      <div className="absolute top-16 left-4 w-16 h-20 bg-gray-200 border border-gray-400 overflow-hidden">
                        {personalData.photo ? (
                          <img src={personalData.photo} alt="ID" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                            Photo
                          </div>
                        )}
                      </div>
                      
                      {/* Personal Info */}
                      <div className="absolute top-16 left-24 right-4 space-y-1">
                        <div>
                          <span className="text-xs text-red-600 font-semibold">Surname/Nom</span>
                          <div className="text-sm font-bold text-gray-900">{personalData.surname || 'Henderson'}</div>
                        </div>
                        <div>
                          <span className="text-xs text-red-600 font-semibold">Given names/Prénoms</span>
                          <div className="text-sm font-bold text-gray-900">{personalData.givenNames || 'Elizabeth'}</div>
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <span className="text-xs text-red-600 font-semibold">Sex/Sexe</span>
                            <div className="text-sm font-bold text-gray-900">{personalData.sex}</div>
                          </div>
                          <div>
                            <span className="text-xs text-red-600 font-semibold">Nationality/Nationalité</span>
                            <div className="text-sm font-bold text-gray-900">{personalData.nationality}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Dates */}
                      <div className="absolute bottom-8 left-4 right-4 flex justify-between text-xs">
                        <div>
                          <span className="text-red-600 font-semibold">Date of birth/Date de naissance</span>
                          <div className="font-bold text-gray-900">
                            {personalData.dateOfBirth ? new Date(personalData.dateOfBirth).toLocaleDateString('en-GB') : '14-04-1977'}
                          </div>
                        </div>
                        <div>
                          <span className="text-red-600 font-semibold">Place of birth/Lieu de naissance</span>
                          <div className="font-bold text-gray-900">{personalData.placeOfBirth || 'London'}</div>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-2 left-4 right-4 flex justify-between text-xs">
                        <div>
                          <span className="text-red-600 font-semibold">Date of issue/Date de délivrance</span>
                          <div className="font-bold text-gray-900">
                            {personalData.dateOfIssue ? new Date(personalData.dateOfIssue).toLocaleDateString('en-GB') : '01-08-2009'}
                          </div>
                        </div>
                        <div>
                          <span className="text-red-600 font-semibold">Date of expiry/Date d'expiration</span>
                          <div className="font-bold text-gray-900">
                            {personalData.dateOfExpiry ? new Date(personalData.dateOfExpiry).toLocaleDateString('en-GB') : '31-07-2019'}
                          </div>
                        </div>
                      </div>
                      
                      {/* UK Coat of Arms */}
                      <div className="absolute top-16 right-4 w-12 h-12 bg-red-800 rounded-full flex items-center justify-center">
                        <div className="text-white text-xs font-bold">UK</div>
                      </div>
                      
                      {/* Signature */}
                      <div className="absolute bottom-12 right-4 text-xs italic text-gray-700">
                        Signature Sample
                      </div>
                      
                      {/* Microtext pattern */}
                      <div className="absolute inset-0 opacity-10 text-xs text-gray-500 overflow-hidden pointer-events-none">
                        <div className="transform rotate-45 whitespace-nowrap">
                          UKIDUKIDUKIDUKIDUKIDUKIDUKIDUKIDUKIDUKIDUKID
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Back Side */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Back Side</h3>
                    <div 
                      ref={cardBackRef}
                      id="card-back"
                      className="relative w-full h-64 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 rounded-lg border-2 border-gray-300 overflow-hidden"
                      style={{
                        backgroundImage: `
                          radial-gradient(circle at 30% 70%, rgba(255,255,255,0.3) 0%, transparent 50%),
                          radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)
                        `
                      }}
                    >
                      {/* Holographic overlay */}
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-transparent animate-pulse"></div>
                      
                      {/* Header */}
                      <div className="absolute top-2 left-4 right-4 text-xs text-gray-700">
                        Issued by Home Office Identity & Passport Service. If found, please send to FREEPOST IPS
                      </div>
                      
                      {/* Chip */}
                      <div className="absolute top-12 left-4 w-12 h-8 bg-yellow-400 rounded border border-gray-400">
                        <div className="grid grid-cols-3 gap-px p-1 h-full">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className="bg-yellow-600 rounded-sm"></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="absolute top-12 left-20 text-xs text-gray-700">
                        <div className="font-semibold">For card enquiries please call</div>
                        <div>0300 330 0000 or visit</div>
                        <div>www.direct.gov.uk/identity</div>
                      </div>
                      
                      {/* QR Code */}
                      {qrCodeUrl && (
                        <div className="absolute top-12 right-4 w-16 h-16 bg-white p-1 border border-gray-300">
                          <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
                        </div>
                      )}
                      
                      {/* MRZ (Machine Readable Zone) */}
                      <div className="absolute bottom-4 left-4 right-4 font-mono text-xs bg-white/80 p-2 rounded">
                        <div>IDGBR{personalData.idNumber || '123456789'}{'<'.repeat(20)}</div>
                        <div>
                          {(personalData.dateOfBirth ? personalData.dateOfBirth.replace(/-/g, '').slice(2) : '770414')}
                          {personalData.sex}
                          {(personalData.dateOfExpiry ? personalData.dateOfExpiry.replace(/-/g, '').slice(2) : '190731')}
                          GBR{'<'.repeat(15)}4
                        </div>
                        <div>
                          {(personalData.surname || 'HENDERSON').toUpperCase()}
                          {'<'.repeat(2)}
                          {(personalData.givenNames || 'ELIZABETH').toUpperCase().replace(/ /g, '<')}
                          {'<'.repeat(10)}
                        </div>
                      </div>
                      
                      {/* Observations */}
                      <div className="absolute top-32 left-4 text-xs text-gray-700">
                        <div className="font-semibold">Observations/Observations</div>
                      </div>
                      
                      {/* Security features indicator */}
                      <div className="absolute bottom-32 right-4 text-6xl font-bold text-gray-300 opacity-50">
                        K
                      </div>
                      
                      {/* Watermark */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                        <div className="text-8xl font-bold text-gray-500 transform rotate-45">
                          UK
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && tempImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Crop Your Photo</h3>
            <div className="mb-4">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={4/5}
                minWidth={100}
                minHeight={125}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={tempImage}
                  style={{ maxHeight: '400px', maxWidth: '100%' }}
                />
              </ReactCrop>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCropper(false)}>
                Cancel
              </Button>
              <Button onClick={applyCrop}>
                Apply Crop
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
