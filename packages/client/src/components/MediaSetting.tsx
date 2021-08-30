import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { mediaStreamManager } from "managers";
import { primaryButtonStyle, textInputStyle } from "styles";
import useInput from "hooks/useInput";
import StyledRelativeHeightDiv from "./common/StyledRelativeHeightDiv";
import VideoCamIconOrig from "components/icons/VideoCamIcon";
import VideoCamOffIconOrig from "components/icons/VideoCamOffIcon";
import { css } from "@emotion/react";
interface MediaSettingProps {
	onFinishMediaSetting: (
		mediaStream: MediaStream | null,
		userName: string
	) => void;
}

const cameraButtonIconStyle = css`
	width: 30px;
	height: 30px;
	border-radius: 50%;
	padding: 8px;
	cursor: pointer;

	& path {
		fill: #f5f5f5 !important;
	}
`;

const Self = styled.div`
	margin: 60px auto 0 auto;
	width: 400px;
`;

const VideoContainer = styled(StyledRelativeHeightDiv)`
	width: 100%;
	border-radius: 3px;
	background: #333;
`;

const StyledVideo = styled.video`
	width: 100%;
	height: 100%;
`;

const StyledButton = styled.button`
	${primaryButtonStyle}
	margin-top: 12px;
	width: 100%;
`;

const StyledInput = styled.input`
	${textInputStyle};
	margin-top: 40px;
	box-sizing: border-box;
	width: 100%;
`;

const StyledErrorMessage = styled.div`
	margin-top: 3px;
	color: #fe015d;
	font-size: 13px;
`;

const NoCameraMessage = styled.div`
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	color: white;
	font-size: 17px;
`;

const CameraControl = styled.div`
	position: absolute;
	bottom: 8px;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
`;

const VideoCamIcon = styled(VideoCamIconOrig)`
	background: rgb(0, 114, 227);
	${cameraButtonIconStyle}
`;

const VideoCamOffIcon = styled(VideoCamOffIconOrig)`
	background: #fe015d;
	${cameraButtonIconStyle}
`;

const MediaSetting: React.FC<MediaSettingProps> = ({
	onFinishMediaSetting,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [mediaStream, setMediaStream] = useState<null | MediaStream>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { value: userName, handleChange: handleChangeUserName } = useInput();

	const setUserMediaStream = () => {
		mediaStreamManager
			.getUserMedia()
			.then((stream) => {
				setMediaStream(stream);
			})
			.catch((e) => {
				// TODO 에러 처리
				console.error("e :", e);
			});
	};

	const handleLoadedMetadata = () => {
		if (videoRef.current) {
			videoRef.current.play();
		}
	};

	const handleClickVideoCamIcon = () => {
		setUserMediaStream();
	};

	const handleClickVideoCamOffIcon = () => {
		setMediaStream(null);
	};

	const handleSubmit = () => {
		if (!userName) {
			setErrorMessage("USER NAME을 설정해 주세요.");
		} else {
			onFinishMediaSetting(mediaStream, userName);
		}
	};

	useEffect(() => {
		setUserMediaStream();
	}, []);

	useEffect(() => {
		if (userName) {
			setErrorMessage(null);
		}
	}, [userName]);

	useEffect(() => {
		if (videoRef.current) {
			if (mediaStream) {
				videoRef.current.srcObject = mediaStream;
			} else {
				videoRef.current.srcObject = null;
			}
		}
	}, [mediaStream, videoRef]);

	return (
		<Self>
			<VideoContainer heightPercent={70}>
				<StyledVideo ref={videoRef} onLoadedMetadata={handleLoadedMetadata} />
				{!mediaStream && <NoCameraMessage>카메라 없음</NoCameraMessage>}
				<CameraControl>
					{mediaStream ? (
						<VideoCamOffIcon onClick={handleClickVideoCamOffIcon} />
					) : (
						<VideoCamIcon onClick={handleClickVideoCamIcon} />
					)}
				</CameraControl>
			</VideoContainer>
			<StyledInput
				placeholder="USER NAME"
				onChange={handleChangeUserName}
				value={userName}
			/>
			<StyledButton onClick={handleSubmit}>입장</StyledButton>
			{errorMessage && <StyledErrorMessage>{errorMessage}</StyledErrorMessage>}
		</Self>
	);
};

export default MediaSetting;
